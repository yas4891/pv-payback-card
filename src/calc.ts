import type { HomeAssistant } from "./card";

export type Unit = "Wh" | "kWh" | "MWh";

export type IndividualConsumerConfig = {
  name: string;
  entity: string;
  value_per_kwh: number;
  baseline?: number;
  icon?: string;
};

export type PVPaybackCardConfig = {
  type: string;
  display_style?: "full" | "compact";
  payback_date_format?: "absolute" | "relative";
  payback_date_relative_reference?: "now" | "start_date";
  start_date: string;
  investment_cost: number;
  electricity_price: number;
  feed_in_tariff: number;
  self_consumption_entity?: string;
  export_energy_entity: string;
  production_energy_entity?: string;
  self_consumption_baseline?: number;
  production_energy_baseline?: number;
  export_energy_baseline?: number;
  individual_consumers?: IndividualConsumerConfig[];
  name?: string;
  icon?: string;
  currency?: string;
  locale?: string;
  show_breakdown?: boolean;
  show_energy_values?: boolean;
  show_money_values?: boolean;
  show_payback_date?: boolean;
  show_progress?: boolean;
  show_contribution_segments?: boolean;
  use_location_seasonality?: boolean;
  annual_discount_rate?: number;
  apply_annual_discount?: boolean;
  /** @deprecated Use apply_annual_discount instead. */
  use_historical_statistics?: boolean;
};

export type StatisticRow = { start?: string | number; start_time?: string; sum?: unknown };
export type HistoricalStatistics = Record<string, StatisticRow[]>;
export type HistoryState = {
  s?: unknown;
  state?: unknown;
  lu?: unknown;
  last_updated?: unknown;
};
export type EntityHistory = Record<string, HistoryState[]>;
export type DailyEnergy = {
  date: string;
  selfConsumption: number;
  exported: number;
  individualConsumers?: Record<string, number>;
};

export type IndividualConsumerContribution = IndividualConsumerConfig & {
  energy: number;
  value: number;
};

export type EnergyRead = {
  value?: number;
  warning?: string;
  cached: boolean;
  timestamp?: string;
  issueKey?: string;
};
export type CachedEnergy = { value: number; timestamp?: string };
export type Calculation = {
  selfConsumption: number;
  regularSelfConsumption: number;
  individualConsumers: IndividualConsumerContribution[];
  individualConsumptionExceedsTotal: boolean;
  exported: number;
  ownValue: number;
  exportValue: number;
  benefit: number;
  progress: number;
  paybackDate?: Date;
  warning?: string;
};

export type ScenarioCalculations = {
  linear: Calculation;
  seasonal: Calculation;
  discounted: Calculation;
};

const DAYS_PER_YEAR = 365.2425;
export const MAXIMUM_FORECAST_DAYS = 366 * 50;

/** A small recency cache for asynchronous calculation and history requests. */
export class BoundedCache<K, V> extends Map<K, V> {
  constructor(private readonly maximumEntries = 20) {
    super();
  }

  override get(key: K): V | undefined {
    const value = super.get(key);
    if (value !== undefined) {
      super.delete(key);
      super.set(key, value);
    }
    return value;
  }

  override set(key: K, value: V): this {
    if (super.has(key)) super.delete(key);
    super.set(key, value);
    while (this.size > this.maximumEntries) {
      const oldestKey = this.keys().next().value as K | undefined;
      if (oldestKey === undefined) break;
      super.delete(oldestKey);
    }
    return this;
  }
}

const historicalStatisticsCache = new BoundedCache<
  string,
  Promise<HistoricalStatistics | undefined>
>();
const lastValidHistoryCache = new BoundedCache<string, Promise<Record<string, CachedEnergy>>>();

export function isUnit(value: unknown): value is Unit {
  return value === "Wh" || value === "kWh" || value === "MWh";
}

export function energyToKwh(value: number, unit: unknown): number | undefined {
  if (!Number.isFinite(value) || !isUnit(unit)) return undefined;
  return unit === "Wh" ? value / 1000 : unit === "MWh" ? value * 1000 : value;
}

export function withDisplayDefaults(config: PVPaybackCardConfig): PVPaybackCardConfig {
  return {
    ...config,
    display_style: config.display_style ?? "full",
    payback_date_format: config.payback_date_format ?? "absolute",
    payback_date_relative_reference: config.payback_date_relative_reference ?? "now",
    show_breakdown: config.show_breakdown ?? true,
    show_energy_values: config.show_energy_values ?? true,
    show_money_values: config.show_money_values ?? true,
    show_payback_date: config.show_payback_date ?? true,
    show_progress: config.show_progress ?? true,
    show_contribution_segments: config.show_contribution_segments ?? false,
    use_location_seasonality: config.use_location_seasonality ?? false,
    annual_discount_rate: config.annual_discount_rate ?? 0,
    apply_annual_discount:
      config.apply_annual_discount ?? config.use_historical_statistics ?? false,
  };
}

export function appliesAnnualDiscount(config: PVPaybackCardConfig): boolean {
  return config.apply_annual_discount ?? config.use_historical_statistics ?? false;
}

export function displayName(name: string | undefined, localizedTitle: string): string {
  return !name || name === "PV-Amortisation" || name === "PV payback" ? localizedTitle : name;
}

function linearPaybackDate(
  start: Date,
  now: Date,
  benefit: number,
  investmentCost: number,
): Date | undefined {
  if (benefit <= 0 || start > now) return undefined;
  const elapsedDays = Math.max(1, (now.getTime() - start.getTime()) / 86_400_000);
  return new Date(start.getTime() + (investmentCost / benefit) * elapsedDays * 86_400_000);
}

export function calendarDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Counts complete calendar months, then the remaining calendar days. */
export function calendarDuration(
  start: Date,
  end: Date,
): {
  years: number;
  months: number;
  days: number;
} {
  const startDay = calendarDay(start);
  const endDay = calendarDay(end);
  const startUtc = Date.UTC(startDay.getFullYear(), startDay.getMonth(), startDay.getDate());
  const endUtc = Date.UTC(endDay.getFullYear(), endDay.getMonth(), endDay.getDate());
  if (endUtc < startUtc) throw new RangeError("End date must not precede start date.");

  const monthAnchor = (months: number): number => {
    const firstDay = new Date(Date.UTC(startDay.getFullYear(), startDay.getMonth() + months, 1));
    const year = firstDay.getUTCFullYear();
    const month = firstDay.getUTCMonth();
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return Date.UTC(year, month, Math.min(startDay.getDate(), lastDay));
  };
  let completeMonths =
    (endDay.getFullYear() - startDay.getFullYear()) * 12 + endDay.getMonth() - startDay.getMonth();
  if (monthAnchor(completeMonths) > endUtc) completeMonths -= 1;
  return {
    years: Math.floor(completeMonths / 12),
    months: completeMonths % 12,
    days: Math.round((endUtc - monthAnchor(completeMonths)) / 86_400_000),
  };
}

function solarPotentialWeight(date: Date, latitude: number): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.round((calendarDay(date).getTime() - startOfYear.getTime()) / 86_400_000);
  const latitudeRadians = (latitude * Math.PI) / 180;
  const declination = 0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);
  const sunsetArgument = -Math.tan(latitudeRadians) * Math.tan(declination);
  const sunsetHourAngle = Math.acos(Math.max(-1, Math.min(1, sunsetArgument)));
  const potential =
    sunsetHourAngle * Math.sin(latitudeRadians) * Math.sin(declination) +
    Math.cos(latitudeRadians) * Math.cos(declination) * Math.sin(sunsetHourAngle);
  return Math.max(0, potential);
}

/**
 * Forecasts a payback date from observed benefit per accumulated daily solar potential.
 * It uses latitude only and does not access external services.
 */
export function calculateSeasonalPaybackDate(
  startDate: string,
  now: Date,
  benefit: number,
  investmentCost: number,
  latitude: number,
): Date | undefined {
  const start = new Date(`${startDate}T00:00:00`);
  if (
    Number.isNaN(start.getTime()) ||
    !Number.isFinite(now.getTime()) ||
    !Number.isFinite(benefit) ||
    benefit <= 0 ||
    !Number.isFinite(investmentCost) ||
    investmentCost <= 0 ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    start > now
  )
    return undefined;

  const observationEnd = calendarDay(now);
  let observedWeight = 0;
  for (let day = calendarDay(start); day <= observationEnd; day.setDate(day.getDate() + 1)) {
    observedWeight += solarPotentialWeight(day, latitude);
  }
  if (!Number.isFinite(observedWeight) || observedWeight <= 0) return undefined;

  const benefitPerWeight = benefit / observedWeight;
  const comparisonTolerance = Math.max(1e-9, investmentCost * Number.EPSILON * 16);
  if (benefit >= investmentCost) {
    let historicalBenefit = 0;
    for (let day = calendarDay(start); day <= observationEnd; day.setDate(day.getDate() + 1)) {
      historicalBenefit += solarPotentialWeight(day, latitude) * benefitPerWeight;
      if (historicalBenefit >= investmentCost - comparisonTolerance) return new Date(day);
    }
    return undefined;
  }

  let projectedBenefit = benefit;
  const forecastDay = new Date(observationEnd);
  for (let day = 0; day < MAXIMUM_FORECAST_DAYS; day += 1) {
    if (projectedBenefit >= investmentCost - comparisonTolerance) return new Date(forecastDay);
    forecastDay.setDate(forecastDay.getDate() + 1);
    projectedBenefit += solarPotentialWeight(forecastDay, latitude) * benefitPerWeight;
  }
  return undefined;
}

export function validLocation(latitude: unknown, longitude: unknown): latitude is number {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function dateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function discountFactor(date: Date, start: Date, annualDiscountRate: number): number {
  const elapsedDays = Math.max(
    0,
    (calendarDay(date).getTime() - calendarDay(start).getTime()) / 86_400_000,
  );
  return 1 / (1 + annualDiscountRate / 100) ** (elapsedDays / DAYS_PER_YEAR);
}

function statisticDate(row: StatisticRow): string | undefined {
  const value = row.start ?? row.start_time;
  if (typeof value === "number") {
    if (!Number.isFinite(value) || Number.isNaN(new Date(value).getTime())) return undefined;
    return dateKey(new Date(value));
  }
  if (typeof value !== "string" || Number.isNaN(new Date(value).getTime())) return undefined;
  return value.slice(0, 10);
}

export function statisticDailyDeltas(rows: StatisticRow[] | undefined): Map<string, number> {
  const result = new Map<string, number>();
  let previous: number | undefined;
  for (const row of rows ?? []) {
    const date = statisticDate(row);
    const sum = typeof row.sum === "number" ? row.sum : Number.NaN;
    if (!date || !Number.isFinite(sum)) {
      previous = undefined;
      continue;
    }
    if (previous !== undefined) {
      const delta = sum - previous;
      if (delta >= 0) result.set(date, delta);
    }
    previous = sum;
  }
  return result;
}

/** Converts Home Assistant cumulative daily sums into defensive daily energy values. */
export function dailyEnergyFromStatistics(
  config: PVPaybackCardConfig,
  statistics: HistoricalStatistics | undefined,
): DailyEnergy[] {
  const exported = statisticDailyDeltas(statistics?.[config.export_energy_entity]);
  const ownSource = config.self_consumption_entity
    ? statisticDailyDeltas(statistics?.[config.self_consumption_entity])
    : undefined;
  const production = config.production_energy_entity
    ? statisticDailyDeltas(statistics?.[config.production_energy_entity])
    : undefined;
  const individualSources = new Map(
    (config.individual_consumers ?? []).map((consumer) => [
      consumer.entity,
      statisticDailyDeltas(statistics?.[consumer.entity]),
    ]),
  );
  const dates = new Set<string>([
    ...exported.keys(),
    ...(ownSource?.keys() ?? []),
    ...(production?.keys() ?? []),
  ]);
  return [...dates].sort().flatMap((date) => {
    const exportValue = exported.get(date);
    if (exportValue === undefined) return [];
    const selfValue = ownSource
      ? ownSource.get(date)
      : production?.get(date) === undefined
        ? undefined
        : Math.max(0, production.get(date)! - exportValue);
    if (selfValue === undefined || !Number.isFinite(selfValue) || selfValue < 0) return [];
    return [
      {
        date,
        selfConsumption: selfValue,
        exported: exportValue,
        ...(individualSources.size > 0
          ? {
              individualConsumers: Object.fromEntries(
                [...individualSources].map(([entity, values]) => [entity, values.get(date) ?? 0]),
              ),
            }
          : {}),
      },
    ];
  });
}

export function historicalStatisticsCacheKey(
  config: PVPaybackCardConfig,
  completedEndDate: string,
): string {
  const sources = config.self_consumption_entity
    ? ["direct", config.self_consumption_entity, config.export_energy_entity]
    : ["derived", config.production_energy_entity, config.export_energy_entity];
  return JSON.stringify([
    sources,
    (config.individual_consumers ?? []).map((consumer) => consumer.entity),
    config.start_date,
    completedEndDate,
  ]);
}

export function loadHistoricalStatistics(
  hass: Pick<HomeAssistant, "callWS">,
  config: PVPaybackCardConfig,
  now = new Date(),
): Promise<HistoricalStatistics | undefined> | undefined {
  if (!hass.callWS || !appliesAnnualDiscount(config) || (config.annual_discount_rate ?? 0) <= 0)
    return undefined;
  const start = new Date(`${config.start_date}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(now.getTime())) return undefined;
  const requestStart = calendarDay(start);
  requestStart.setDate(requestStart.getDate() - 1);
  const requestEnd = calendarDay(now);
  const completedEnd = calendarDay(now);
  completedEnd.setDate(completedEnd.getDate() - 1);
  const end = dateKey(completedEnd);
  const key = historicalStatisticsCacheKey(config, end);
  const existing = historicalStatisticsCache.get(key);
  if (existing) return existing;
  const statisticIds = config.self_consumption_entity
    ? [config.self_consumption_entity, config.export_energy_entity]
    : [config.production_energy_entity!, config.export_energy_entity];
  statisticIds.push(...(config.individual_consumers ?? []).map((consumer) => consumer.entity));
  const request = hass
    .callWS({
      type: "recorder/statistics_during_period",
      start_time: `${dateKey(requestStart)}T00:00:00`,
      end_time: `${dateKey(requestEnd)}T00:00:00`,
      statistic_ids: statisticIds,
      period: "day",
      types: ["sum"],
    })
    .then((response) =>
      response && typeof response === "object" ? (response as HistoricalStatistics) : undefined,
    )
    .catch(() => undefined);
  historicalStatisticsCache.set(key, request);
  return request;
}

function distributionWeights(
  config: PVPaybackCardConfig,
  start: Date,
  end: Date,
  location?: { latitude?: number; longitude?: number },
): Array<{ date: Date; weight: number }> {
  const seasonal =
    config.use_location_seasonality && validLocation(location?.latitude, location?.longitude);
  const days: Array<{ date: Date; weight: number }> = [];
  for (let day = calendarDay(start); day <= calendarDay(end); day.setDate(day.getDate() + 1)) {
    days.push({
      date: new Date(day),
      weight: seasonal ? solarPotentialWeight(day, location!.latitude!) : 1,
    });
  }
  const total = days.reduce((sum, day) => sum + day.weight, 0);
  return total > 0 ? days : days.map((day) => ({ ...day, weight: 1 }));
}

/** Preserves current counter totals while using statistics only for their timing. */
export function distributeHistoricalEnergy(
  config: PVPaybackCardConfig,
  selfConsumption: number,
  exported: number,
  now: Date,
  location?: { latitude?: number; longitude?: number },
  historicalDays?: DailyEnergy[],
  individualConsumers: IndividualConsumerContribution[] = [],
): DailyEnergy[] {
  const start = new Date(`${config.start_date}T00:00:00`);
  if (Number.isNaN(start.getTime()) || start > now) return [];
  const weights = distributionWeights(config, start, now, location);
  const historic = new Map((historicalDays ?? []).map((day) => [day.date, day]));
  const distribute = (total: number, field: "selfConsumption" | "exported") => {
    const observed = weights.map(({ date }) =>
      Math.max(0, historic.get(dateKey(date))?.[field] ?? 0),
    );
    const observedTotal = observed.reduce((sum, value) => sum + value, 0);
    const fallbackTotal = weights.reduce(
      (sum, day, index) => sum + (observed[index] > 0 ? 0 : day.weight),
      0,
    );
    const values = weights.map((day, index) => {
      if (observedTotal > 0 && observed[index] > 0) return observed[index];
      return fallbackTotal > 0 ? (total * day.weight) / fallbackTotal : 0;
    });
    const rawTotal = values.reduce((sum, value) => sum + value, 0);
    return rawTotal > 0 ? values.map((value) => (value * total) / rawTotal) : values;
  };
  const own = distribute(Math.max(0, selfConsumption), "selfConsumption");
  const exportValues = distribute(Math.max(0, exported), "exported");
  const individualValues = new Map(
    individualConsumers.map((consumer) => {
      const observed = weights.map(({ date }) =>
        Math.max(0, historic.get(dateKey(date))?.individualConsumers?.[consumer.entity] ?? 0),
      );
      const observedTotal = observed.reduce((sum, value) => sum + value, 0);
      const fallbackTotal = weights.reduce(
        (sum, day, index) => sum + (observed[index] > 0 ? 0 : day.weight),
        0,
      );
      const values = weights.map((day, index) => {
        if (observedTotal > 0 && observed[index] > 0) return observed[index];
        return fallbackTotal > 0 ? (consumer.energy * day.weight) / fallbackTotal : 0;
      });
      const rawTotal = values.reduce((sum, value) => sum + value, 0);
      return [
        consumer.entity,
        rawTotal > 0 ? values.map((value) => (value * consumer.energy) / rawTotal) : values,
      ] as const;
    }),
  );
  return weights.map((day, index) => ({
    date: dateKey(day.date),
    selfConsumption: own[index],
    exported: exportValues[index],
    individualConsumers: Object.fromEntries(
      [...individualValues].map(([entity, values]) => [entity, values[index]]),
    ),
  }));
}

function discountedPaybackDate(
  config: PVPaybackCardConfig,
  now: Date,
  dailyEnergy: DailyEnergy[],
  location?: { latitude?: number; longitude?: number },
): {
  regularValue: number;
  individualValues: Record<string, number>;
  exportValue: number;
  paybackDate?: Date;
} {
  const start = new Date(`${config.start_date}T00:00:00`);
  const rate = config.annual_discount_rate ?? 0;
  let regularValue = 0;
  const individualValues: Record<string, number> = {};
  let exportValue = 0;
  let accumulated = 0;
  let historicalPaybackDate: Date | undefined;
  for (const day of dailyEnergy) {
    const date = new Date(`${day.date}T00:00:00`);
    const factor = discountFactor(date, start, rate);
    const individualEnergy = (config.individual_consumers ?? []).reduce(
      (sum, consumer) => sum + (day.individualConsumers?.[consumer.entity] ?? 0),
      0,
    );
    const own =
      Math.max(0, day.selfConsumption - individualEnergy) * config.electricity_price * factor;
    const exported = day.exported * config.feed_in_tariff * discountFactor(date, start, rate);
    regularValue += own;
    let individualValue = 0;
    for (const consumer of config.individual_consumers ?? []) {
      const value =
        (day.individualConsumers?.[consumer.entity] ?? 0) * consumer.value_per_kwh * factor;
      individualValues[consumer.entity] = (individualValues[consumer.entity] ?? 0) + value;
      individualValue += value;
    }
    exportValue += exported;
    accumulated += own + individualValue + exported;
    if (!historicalPaybackDate && accumulated >= config.investment_cost)
      historicalPaybackDate = date;
  }
  if (historicalPaybackDate)
    return { regularValue, individualValues, exportValue, paybackDate: historicalPaybackDate };
  const seasonal =
    config.use_location_seasonality && validLocation(location?.latitude, location?.longitude);
  const observedWeights = dailyEnergy.reduce(
    (sum, day) =>
      sum +
      (seasonal ? solarPotentialWeight(new Date(`${day.date}T00:00:00`), location!.latitude!) : 1),
    0,
  );
  const nominalBenefit = dailyEnergy.reduce(
    (sum, day) =>
      sum +
      Math.max(
        0,
        day.selfConsumption -
          (config.individual_consumers ?? []).reduce(
            (total, consumer) => total + (day.individualConsumers?.[consumer.entity] ?? 0),
            0,
          ),
      ) *
        config.electricity_price +
      (config.individual_consumers ?? []).reduce(
        (total, consumer) =>
          total + (day.individualConsumers?.[consumer.entity] ?? 0) * consumer.value_per_kwh,
        0,
      ) +
      day.exported * config.feed_in_tariff,
    0,
  );
  if (observedWeights <= 0 || nominalBenefit <= 0)
    return { regularValue, individualValues, exportValue };
  const benefitPerWeight = nominalBenefit / observedWeights;
  const forecastDay = calendarDay(now);
  for (let offset = 0; offset < MAXIMUM_FORECAST_DAYS; offset += 1) {
    forecastDay.setDate(forecastDay.getDate() + 1);
    const weight = seasonal ? solarPotentialWeight(forecastDay, location!.latitude!) : 1;
    accumulated += benefitPerWeight * weight * discountFactor(forecastDay, start, rate);
    if (accumulated >= config.investment_cost)
      return { regularValue, individualValues, exportValue, paybackDate: new Date(forecastDay) };
  }
  return { regularValue, individualValues, exportValue };
}

export function calculatePayback(
  config: PVPaybackCardConfig,
  selfConsumptionOrProduction: number,
  exported: number,
  now = new Date(),
  location?: { latitude?: number; longitude?: number },
  historicalDays?: DailyEnergy[],
  individualConsumerReadings: Record<string, number> = {},
): Calculation {
  const exportEnergy = Math.max(0, exported - (config.export_energy_baseline ?? 0));
  const own = config.self_consumption_entity
    ? Math.max(0, selfConsumptionOrProduction - (config.self_consumption_baseline ?? 0))
    : Math.max(
        0,
        selfConsumptionOrProduction - (config.production_energy_baseline ?? 0) - exportEnergy,
      );
  const individualConsumers = (config.individual_consumers ?? []).map((consumer) => ({
    ...consumer,
    energy: Math.max(
      0,
      (individualConsumerReadings[consumer.entity] ?? 0) - (consumer.baseline ?? 0),
    ),
    value: 0,
  }));
  const individualEnergy = individualConsumers.reduce((sum, consumer) => sum + consumer.energy, 0);
  const regularSelfConsumption = Math.max(0, own - individualEnergy);
  const individualConsumptionExceedsTotal = individualEnergy > own;
  const nominalRegularValue = regularSelfConsumption * config.electricity_price;
  const nominalIndividualConsumers = individualConsumers.map((consumer) => ({
    ...consumer,
    value: consumer.energy * consumer.value_per_kwh,
  }));
  const nominalOwnValue =
    nominalRegularValue +
    nominalIndividualConsumers.reduce((sum, consumer) => sum + consumer.value, 0);
  const nominalExportValue = exportEnergy * config.feed_in_tariff;
  if (appliesAnnualDiscount(config) && (config.annual_discount_rate ?? 0) > 0) {
    const dailyEnergy = distributeHistoricalEnergy(
      config,
      own,
      exportEnergy,
      now,
      location,
      historicalDays,
      individualConsumers,
    );
    const discounted = discountedPaybackDate(config, now, dailyEnergy, location);
    const discountedIndividualConsumers = individualConsumers.map((consumer) => ({
      ...consumer,
      value: discounted.individualValues[consumer.entity] ?? 0,
    }));
    const ownValue =
      discounted.regularValue +
      discountedIndividualConsumers.reduce((sum, consumer) => sum + consumer.value, 0);
    const benefit = ownValue + discounted.exportValue;
    return {
      selfConsumption: own,
      regularSelfConsumption,
      individualConsumers: discountedIndividualConsumers,
      individualConsumptionExceedsTotal,
      exported: exportEnergy,
      ownValue,
      exportValue: discounted.exportValue,
      benefit,
      progress: Math.min(100, (benefit / config.investment_cost) * 100),
      paybackDate: discounted.paybackDate,
    };
  }
  const ownValue = nominalOwnValue;
  const exportValue = nominalExportValue;
  const benefit = ownValue + exportValue;
  const progress = Math.min(100, (benefit / config.investment_cost) * 100);
  const start = new Date(`${config.start_date}T00:00:00`);
  const linearDate = linearPaybackDate(start, now, benefit, config.investment_cost);
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  const paybackDate =
    config.use_location_seasonality && validLocation(latitude, longitude)
      ? (calculateSeasonalPaybackDate(
          config.start_date,
          now,
          benefit,
          config.investment_cost,
          latitude,
        ) ?? linearDate)
      : linearDate;
  return {
    selfConsumption: own,
    regularSelfConsumption,
    individualConsumers: nominalIndividualConsumers,
    individualConsumptionExceedsTotal,
    exported: exportEnergy,
    ownValue,
    exportValue,
    benefit,
    progress,
    paybackDate,
  };
}

/** Calculates all comparison scenarios independently from the card's display options. */
export function calculateScenarioComparisons(
  config: PVPaybackCardConfig,
  selfConsumptionOrProduction: number,
  exported: number,
  now = new Date(),
  location?: { latitude?: number; longitude?: number },
  historicalDays?: DailyEnergy[],
  comparisonDiscountRate = config.annual_discount_rate ?? 3,
  individualConsumerReadings: Record<string, number> = {},
): ScenarioCalculations {
  const base = {
    ...config,
    apply_annual_discount: false,
    use_historical_statistics: false,
  };
  return {
    linear: calculatePayback(
      { ...base, use_location_seasonality: false, annual_discount_rate: 0 },
      selfConsumptionOrProduction,
      exported,
      now,
      location,
      historicalDays,
      individualConsumerReadings,
    ),
    seasonal: calculatePayback(
      { ...base, use_location_seasonality: true, annual_discount_rate: 0 },
      selfConsumptionOrProduction,
      exported,
      now,
      location,
      historicalDays,
      individualConsumerReadings,
    ),
    discounted: calculatePayback(
      {
        ...base,
        use_location_seasonality: true,
        annual_discount_rate: comparisonDiscountRate,
        apply_annual_discount: true,
      },
      selfConsumptionOrProduction,
      exported,
      now,
      location,
      historicalDays,
      individualConsumerReadings,
    ),
  };
}

export function cacheKey(config: PVPaybackCardConfig, entity: string): string {
  const directSelfConsumption = Boolean(config.self_consumption_entity);
  const scope = JSON.stringify([
    directSelfConsumption ? "direct-self-consumption" : "derived-self-consumption",
    directSelfConsumption ? config.self_consumption_entity : config.production_energy_entity,
    config.export_energy_entity,
    config.start_date,
    config.self_consumption_baseline ?? 0,
    config.production_energy_baseline ?? 0,
    config.export_energy_baseline ?? 0,
    config.individual_consumers ?? [],
  ]);
  return `pv-payback-card:last-valid:${scope}:${entity}`;
}

export function latestValidEnergyFromHistory(
  states: HistoryState[] | undefined,
  unit: Unit,
): CachedEnergy | undefined {
  if (!states) return undefined;
  for (let index = states.length - 1; index >= 0; index -= 1) {
    const state = states[index];
    const raw = state.s ?? state.state;
    if ((typeof raw === "string" && raw.trim() === "") || raw === null || raw === undefined)
      continue;
    const numeric = typeof raw === "number" ? raw : Number(raw);
    const value = energyToKwh(numeric, unit);
    if (value === undefined || value < 0) continue;
    const timestamp =
      typeof state.last_updated === "string"
        ? state.last_updated
        : typeof state.lu === "number" && Number.isFinite(state.lu)
          ? new Date(state.lu * 1000).toISOString()
          : undefined;
    return { value, timestamp };
  }
  return undefined;
}

export function loadLastValidEnergyHistory(
  hass: Pick<HomeAssistant, "callWS">,
  entities: Record<string, Unit>,
  now = new Date(),
): Promise<Record<string, CachedEnergy>> | undefined {
  const entityIds = Object.keys(entities).sort();
  if (!hass.callWS || entityIds.length === 0 || Number.isNaN(now.getTime())) return undefined;
  const cacheWindow = Math.floor(now.getTime() / (5 * 60 * 1000));
  const key = JSON.stringify([entityIds, cacheWindow]);
  const existing = lastValidHistoryCache.get(key);
  if (existing) return existing;
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const request = hass
    .callWS({
      type: "history/history_during_period",
      start_time: start.toISOString(),
      end_time: now.toISOString(),
      entity_ids: entityIds,
      include_start_time_state: true,
      significant_changes_only: true,
      minimal_response: true,
      no_attributes: true,
    })
    .then((response) => {
      if (!response || typeof response !== "object") return {};
      const history = response as EntityHistory;
      return Object.fromEntries(
        entityIds.flatMap((entityId) => {
          const value = latestValidEnergyFromHistory(history[entityId], entities[entityId]);
          return value ? [[entityId, value] as const] : [];
        }),
      );
    })
    .catch(() => ({}));
  lastValidHistoryCache.set(key, request);
  return request;
}

export function parseCachedEnergy(raw: string | null): CachedEnergy | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as { value?: unknown; timestamp?: unknown };
    if (typeof parsed.value !== "number" || !Number.isFinite(parsed.value) || parsed.value < 0)
      return undefined;
    return {
      value: parsed.value,
      timestamp: typeof parsed.timestamp === "string" ? parsed.timestamp : undefined,
    };
  } catch {
    return undefined;
  }
}

export function readCachedEnergy(
  storage: Pick<Storage, "getItem">,
  key: string,
): CachedEnergy | undefined {
  try {
    return parseCachedEnergy(storage.getItem(key));
  } catch {
    return undefined;
  }
}

export function chooseEnergyValue(
  current: number | undefined,
  cached: CachedEnergy | undefined,
): { value?: number; cached: boolean; regression: boolean } {
  if (current !== undefined && current >= 0) {
    if (cached && current < cached.value) {
      return { value: cached.value, cached: true, regression: true };
    }
    return { value: current, cached: false, regression: false };
  }
  return cached
    ? { value: cached.value, cached: true, regression: false }
    : { cached: false, regression: false };
}

export function validConfig(config: PVPaybackCardConfig): string | undefined {
  if (config.display_style !== undefined && !["full", "compact"].includes(config.display_style))
    return "display_style";
  if (
    config.payback_date_format !== undefined &&
    !["absolute", "relative"].includes(config.payback_date_format)
  )
    return "payback_date_format";
  if (
    config.payback_date_relative_reference !== undefined &&
    !["now", "start_date"].includes(config.payback_date_relative_reference)
  )
    return "payback_date_relative_reference";
  if (!config.start_date || Number.isNaN(new Date(`${config.start_date}T00:00:00`).getTime()))
    return "start_date";
  for (const key of ["investment_cost", "electricity_price", "feed_in_tariff"] as const) {
    if (!Number.isFinite(config[key]) || config[key] < 0) return key;
  }
  if (config.investment_cost <= 0) return "investment_cost";
  for (const key of [
    "self_consumption_baseline",
    "production_energy_baseline",
    "export_energy_baseline",
  ] as const) {
    const value = config[key];
    if (value !== undefined && !Number.isFinite(value)) return key;
  }
  if (!Number.isFinite(config.annual_discount_rate ?? 0) || (config.annual_discount_rate ?? 0) < 0)
    return "annual_discount_rate";
  const individualEntities = new Set<string>();
  for (const consumer of config.individual_consumers ?? []) {
    if (!consumer.name?.trim()) return "individual_consumers.name";
    if (!consumer.entity?.trim()) return "individual_consumers.entity";
    if (individualEntities.has(consumer.entity)) return "individual_consumers.entity";
    individualEntities.add(consumer.entity);
    if (!Number.isFinite(consumer.value_per_kwh) || consumer.value_per_kwh < 0)
      return "individual_consumers.value_per_kwh";
    if (consumer.baseline !== undefined && !Number.isFinite(consumer.baseline))
      return "individual_consumers.baseline";
  }
  if (
    !config.export_energy_entity ||
    (!config.self_consumption_entity && !config.production_energy_entity)
  )
    return "energy entity";
  return undefined;
}

export function assertConfigStructure(config: unknown): asserts config is PVPaybackCardConfig {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("Invalid configuration: expected an object.");
  }
  const candidate = config as Partial<PVPaybackCardConfig>;
  if (candidate.type !== "custom:pv-payback-card") {
    throw new Error("Invalid configuration: type must be custom:pv-payback-card.");
  }
  if (
    typeof candidate.export_energy_entity !== "string" ||
    !candidate.export_energy_entity.trim()
  ) {
    throw new Error("Invalid configuration: export_energy_entity is required.");
  }
  const hasSelfConsumption =
    typeof candidate.self_consumption_entity === "string" &&
    candidate.self_consumption_entity.trim().length > 0;
  const hasProduction =
    typeof candidate.production_energy_entity === "string" &&
    candidate.production_energy_entity.trim().length > 0;
  if (!hasSelfConsumption && !hasProduction) {
    throw new Error(
      "Invalid configuration: self_consumption_entity or production_energy_entity is required.",
    );
  }
  if (candidate.individual_consumers !== undefined) {
    if (!Array.isArray(candidate.individual_consumers)) {
      throw new Error("Invalid configuration: individual_consumers must be an array.");
    }
    for (const consumer of candidate.individual_consumers) {
      if (
        !consumer ||
        typeof consumer !== "object" ||
        typeof consumer.name !== "string" ||
        typeof consumer.entity !== "string" ||
        typeof consumer.value_per_kwh !== "number" ||
        (consumer.baseline !== undefined && typeof consumer.baseline !== "number") ||
        (consumer.icon !== undefined && typeof consumer.icon !== "string")
      ) {
        throw new Error("Invalid configuration: malformed individual consumer.");
      }
    }
  }
}
