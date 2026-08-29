import { LitElement, css, html, nothing, type TemplateResult } from "lit";

type Unit = "Wh" | "kWh" | "MWh";
type EntityState = { state: string; attributes?: Record<string, unknown>; last_updated?: string };
type HomeAssistant = {
  states: Record<string, EntityState>;
  locale?: { language?: string };
  config?: { currency?: string; latitude?: number; longitude?: number };
  callWS?: (message: Record<string, unknown>) => Promise<unknown>;
};

export type PVPaybackCardConfig = {
  type: string;
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
export type DailyEnergy = { date: string; selfConsumption: number; exported: number };

type EnergyRead = { value?: number; warning?: string; cached: boolean; timestamp?: string };
export type CachedEnergy = { value: number; timestamp?: string };
type Calculation = {
  selfConsumption: number;
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
const MAXIMUM_FORECAST_DAYS = 366 * 50;
const historicalStatisticsCache = new Map<string, Promise<HistoricalStatistics | undefined>>();

const translations = {
  de: {
    title: "Amortisation der PV-Anlage",
    benefit: "Bisheriger Ertrag",
    progress: "Amortisation",
    own: "Eigenverbrauch",
    export: "Einspeisung",
    expected: "Voraussichtlich amortisiert",
    noProjection: "Eine Prognose benötigt einen positiven Ertrag.",
    unavailable: "Es liegen noch keine gültigen Energiewerte vor.",
    unsupportedUnit: "Erwartet wird Wh, kWh oder MWh",
    entityUnavailable: "nicht verfügbar",
    cached: "Letzter gültiger Datenstand",
    counterRegression:
      "Zählerstand ist niedriger als der zuletzt gültige Wert. Gespeicherter Wert wird weiter verwendet.",
    invalid: "Ungültige Konfiguration",
    scenariosTitle: "Amortisationsszenarien",
    scenariosOpen: "Amortisationsszenarien öffnen",
    scenarioLinear: "Nur linear",
    scenarioSeasonal: "Mit Saisonalität",
    scenarioDiscounted: "Mit Saisonalität und Abzinsung",
    discountRate: "Abzinsungssatz",
    defaultRate: "Standardwert",
    locationFallback:
      "Der Home-Assistant-Standort fehlt. Die saisonalen Szenarien verwenden deshalb die lineare Prognose.",
    close: "Schließen",
  },
  en: {
    title: "PV payback",
    benefit: "Benefit to date",
    progress: "Payback",
    own: "Self-consumption",
    export: "Export",
    expected: "Estimated payback",
    noProjection: "A positive benefit is required for a projection.",
    unavailable: "No valid energy values are available yet.",
    unsupportedUnit: "Expected Wh, kWh, or MWh",
    entityUnavailable: "unavailable",
    cached: "Last valid data",
    counterRegression:
      "Counter value is lower than the last valid value. The saved value remains in use.",
    invalid: "Invalid configuration",
    scenariosTitle: "Payback scenarios",
    scenariosOpen: "Open payback scenarios",
    scenarioLinear: "Linear only",
    scenarioSeasonal: "With seasonality",
    scenarioDiscounted: "With seasonality and discounting",
    discountRate: "Discount rate",
    defaultRate: "default",
    locationFallback:
      "The Home Assistant location is unavailable. The seasonal scenarios therefore use the linear forecast.",
    close: "Close",
  },
} as const;

const editorTranslations = {
  de: {
    start_date: "Startdatum",
    investment_cost: "Investitionskosten",
    electricity_price: "Strompreis pro kWh",
    feed_in_tariff: "Einspeisevergütung pro kWh",
    self_consumption_entity: "Entität für Eigenverbrauch",
    export_energy_entity: "Entität für Einspeisung",
    production_energy_entity: "Entität für PV-Produktion",
    self_consumption_baseline: "Ausgangswert Eigenverbrauch (kWh)",
    production_energy_baseline: "Ausgangswert PV-Produktion (kWh)",
    export_energy_baseline: "Ausgangswert Einspeisung (kWh)",
    show_breakdown: "Aufschlüsselung anzeigen",
    show_energy_values: "Energiewerte anzeigen",
    show_money_values: "Geldwerte anzeigen",
    show_payback_date: "Amortisationsdatum anzeigen",
    show_progress: "Fortschritt anzeigen",
    show_contribution_segments: "Anteile im Fortschrittsbalken getrennt anzeigen",
    use_location_seasonality: "Saisonale Prognose vom Home-Assistant-Standort verwenden",
    annual_discount_rate: "Jährlicher Abzinsungssatz in Prozent",
    apply_annual_discount: "Jährliche Abzinsung anwenden",
  },
  en: {
    start_date: "Start date",
    investment_cost: "Investment cost",
    electricity_price: "Electricity price per kWh",
    feed_in_tariff: "Feed-in tariff per kWh",
    self_consumption_entity: "Self-consumption energy entity",
    export_energy_entity: "Export energy entity",
    production_energy_entity: "PV production energy entity",
    self_consumption_baseline: "Self-consumption baseline (kWh)",
    production_energy_baseline: "PV production baseline (kWh)",
    export_energy_baseline: "Export baseline (kWh)",
    show_breakdown: "Show breakdown",
    show_energy_values: "Show energy values",
    show_money_values: "Show monetary values",
    show_payback_date: "Show payback date",
    show_progress: "Show progress",
    show_contribution_segments: "Show separate contribution segments in progress bar",
    use_location_seasonality: "Use seasonal forecast from the Home Assistant location",
    annual_discount_rate: "Annual discount rate in percent",
    apply_annual_discount: "Apply annual discounting",
  },
} as const;

function isUnit(value: unknown): value is Unit {
  return value === "Wh" || value === "kWh" || value === "MWh";
}

export function energyToKwh(value: number, unit: unknown): number | undefined {
  if (!Number.isFinite(value) || !isUnit(unit)) return undefined;
  return unit === "Wh" ? value / 1000 : unit === "MWh" ? value * 1000 : value;
}

export function withDisplayDefaults(config: PVPaybackCardConfig): PVPaybackCardConfig {
  return {
    ...config,
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
  return !name || name === "PV-Amortisation" ? localizedTitle : name;
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

function calendarDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
  const maximumForecastDays = 366 * 50;
  for (let day = 0; day < maximumForecastDays; day += 1) {
    if (projectedBenefit >= investmentCost - comparisonTolerance) return new Date(forecastDay);
    forecastDay.setDate(forecastDay.getDate() + 1);
    projectedBenefit += solarPotentialWeight(forecastDay, latitude) * benefitPerWeight;
  }
  return undefined;
}

function validLocation(latitude: unknown, longitude: unknown): latitude is number {
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

function dateKey(date: Date): string {
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
    return [{ date, selfConsumption: selfValue, exported: exportValue }];
  });
}

export function historicalStatisticsCacheKey(
  config: PVPaybackCardConfig,
  completedEndDate: string,
): string {
  const sources = config.self_consumption_entity
    ? ["direct", config.self_consumption_entity, config.export_energy_entity]
    : ["derived", config.production_energy_entity, config.export_energy_entity];
  return JSON.stringify([sources, config.start_date, completedEndDate]);
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
  return weights.map((day, index) => ({
    date: dateKey(day.date),
    selfConsumption: own[index],
    exported: exportValues[index],
  }));
}

function discountedPaybackDate(
  config: PVPaybackCardConfig,
  now: Date,
  dailyEnergy: DailyEnergy[],
  location?: { latitude?: number; longitude?: number },
): { ownValue: number; exportValue: number; paybackDate?: Date } {
  const start = new Date(`${config.start_date}T00:00:00`);
  const rate = config.annual_discount_rate ?? 0;
  let ownValue = 0;
  let exportValue = 0;
  let accumulated = 0;
  let historicalPaybackDate: Date | undefined;
  for (const day of dailyEnergy) {
    const date = new Date(`${day.date}T00:00:00`);
    const own = day.selfConsumption * config.electricity_price * discountFactor(date, start, rate);
    const exported = day.exported * config.feed_in_tariff * discountFactor(date, start, rate);
    ownValue += own;
    exportValue += exported;
    accumulated += own + exported;
    if (!historicalPaybackDate && accumulated >= config.investment_cost)
      historicalPaybackDate = date;
  }
  if (historicalPaybackDate) return { ownValue, exportValue, paybackDate: historicalPaybackDate };
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
      sum + day.selfConsumption * config.electricity_price + day.exported * config.feed_in_tariff,
    0,
  );
  if (observedWeights <= 0 || nominalBenefit <= 0) return { ownValue, exportValue };
  const benefitPerWeight = nominalBenefit / observedWeights;
  const forecastDay = calendarDay(now);
  for (let offset = 0; offset < MAXIMUM_FORECAST_DAYS; offset += 1) {
    forecastDay.setDate(forecastDay.getDate() + 1);
    const weight = seasonal ? solarPotentialWeight(forecastDay, location!.latitude!) : 1;
    accumulated += benefitPerWeight * weight * discountFactor(forecastDay, start, rate);
    if (accumulated >= config.investment_cost)
      return { ownValue, exportValue, paybackDate: new Date(forecastDay) };
  }
  return { ownValue, exportValue };
}

export function calculatePayback(
  config: PVPaybackCardConfig,
  selfConsumptionOrProduction: number,
  exported: number,
  now = new Date(),
  location?: { latitude?: number; longitude?: number },
  historicalDays?: DailyEnergy[],
): Calculation {
  const exportEnergy = Math.max(0, exported - (config.export_energy_baseline ?? 0));
  const own = config.self_consumption_entity
    ? Math.max(0, selfConsumptionOrProduction - (config.self_consumption_baseline ?? 0))
    : Math.max(
        0,
        selfConsumptionOrProduction - (config.production_energy_baseline ?? 0) - exportEnergy,
      );
  const nominalOwnValue = own * config.electricity_price;
  const nominalExportValue = exportEnergy * config.feed_in_tariff;
  if (appliesAnnualDiscount(config) && (config.annual_discount_rate ?? 0) > 0) {
    const dailyEnergy = distributeHistoricalEnergy(
      config,
      own,
      exportEnergy,
      now,
      location,
      historicalDays,
    );
    const discounted = discountedPaybackDate(config, now, dailyEnergy, location);
    const benefit = discounted.ownValue + discounted.exportValue;
    return {
      selfConsumption: own,
      exported: exportEnergy,
      ownValue: discounted.ownValue,
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
    ),
    seasonal: calculatePayback(
      { ...base, use_location_seasonality: true, annual_discount_rate: 0 },
      selfConsumptionOrProduction,
      exported,
      now,
      location,
      historicalDays,
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
  ]);
  return `pv-payback-card:last-valid:${scope}:${entity}`;
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

function validConfig(config: PVPaybackCardConfig): string | undefined {
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
  if (
    !config.export_energy_entity ||
    (!config.self_consumption_entity && !config.production_energy_entity)
  )
    return "energy entity";
  return undefined;
}

export class PVPaybackCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };
  declare hass?: HomeAssistant;
  declare _config: Partial<PVPaybackCardConfig>;

  constructor() {
    super();
    this._config = {};
  }

  setConfig(config: PVPaybackCardConfig): void {
    this._config = { ...config };
  }

  private changed(event: Event): void {
    const target = event.target as HTMLInputElement;
    const numeric = [
      "investment_cost",
      "electricity_price",
      "feed_in_tariff",
      "self_consumption_baseline",
      "production_energy_baseline",
      "export_energy_baseline",
      "annual_discount_rate",
    ].includes(target.name);
    const value =
      target.type === "checkbox" ? target.checked : numeric ? Number(target.value) : target.value;
    this._config = { ...this._config, [target.name]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private entityChanged(
    name: "self_consumption_entity" | "export_energy_entity" | "production_energy_entity",
    event: Event,
  ): void {
    const value = (event as CustomEvent<{ value?: unknown }>).detail?.value;
    if (typeof value !== "string") return;
    this._config = { ...this._config, [name]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private entityField(
    name: "self_consumption_entity" | "export_energy_entity" | "production_energy_entity",
    label: string,
  ): TemplateResult {
    const value = String(this._config[name] ?? "");
    const pickerAvailable = Boolean(this.hass && customElements.get("ha-entity-picker"));
    if (pickerAvailable) {
      return html`<ha-entity-picker
        .hass=${this.hass}
        .value=${value}
        .label=${label}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${true}
        @value-changed=${(event: Event) => this.entityChanged(name, event)}
      ></ha-entity-picker>`;
    }
    return html`<label
      >${label}<input name=${name} type="text" .value=${value} @change=${this.changed}
    /></label>`;
  }

  render(): TemplateResult | typeof nothing {
    const text =
      editorTranslations[
        (this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de")
          ? "de"
          : "en"
      ];
    const requiredFields: Array<[keyof PVPaybackCardConfig, string, string]> = [
      ["start_date", text.start_date, "date"],
      ["investment_cost", text.investment_cost, "number"],
      ["electricity_price", text.electricity_price, "number"],
      ["feed_in_tariff", text.feed_in_tariff, "number"],
    ];
    const usesDirectSelfConsumption = Boolean(this._config.self_consumption_entity);
    const baselineFields: Array<[keyof PVPaybackCardConfig, string, string]> = [
      usesDirectSelfConsumption
        ? ["self_consumption_baseline", text.self_consumption_baseline, "number"]
        : ["production_energy_baseline", text.production_energy_baseline, "number"],
      ["export_energy_baseline", text.export_energy_baseline, "number"],
      ["annual_discount_rate", text.annual_discount_rate, "number"],
    ];
    const textField = ([name, label, type]: [keyof PVPaybackCardConfig, string, string]) =>
      html`<label
        >${label}<input
          name=${name}
          type=${type}
          step="any"
          .value=${String(this._config[name] ?? "")}
          @change=${this.changed}
      /></label>`;
    return html`${requiredFields.map(
      textField,
    )}${this.entityField("self_consumption_entity", text.self_consumption_entity)}${this.entityField("production_energy_entity", text.production_energy_entity)}${this.entityField("export_energy_entity", text.export_energy_entity)}${baselineFields.map(
      textField,
    )}${(
      [
        "show_breakdown",
        "show_energy_values",
        "show_money_values",
        "show_payback_date",
        "show_progress",
        "show_contribution_segments",
        "use_location_seasonality",
        "apply_annual_discount",
      ] as const
    ).map(
      (name) =>
        html`<label
          ><input
            name=${name}
            type="checkbox"
            .checked=${
              name === "show_contribution_segments" ||
              name === "use_location_seasonality" ||
              name === "apply_annual_discount"
                ? this._config[name] === true
                : this._config[name] !== false
            }
            @change=${this.changed}
          />${text[name]}</label
        >`,
    )}`;
  }

  static styles = css`
    label {
      display: block;
      margin: 10px 0;
    }
    input {
      box-sizing: border-box;
      display: block;
      width: 100%;
      min-height: 44px;
      padding: 8px;
    }
    label:has(input[type="checkbox"]) {
      display: flex;
      min-height: 44px;
      align-items: center;
    }
    label:has(input[type="checkbox"]) input {
      display: inline;
      width: 20px;
      min-height: 20px;
      margin-inline-end: 8px;
    }
  `;
}
customElements.define("pv-payback-card-editor", PVPaybackCardEditor);

export class PVPaybackCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _scenarioDialogOpen: { state: true },
  };
  declare hass?: HomeAssistant;
  declare _config?: PVPaybackCardConfig;
  declare _scenarioDialogOpen: boolean;

  constructor() {
    super();
    this._scenarioDialogOpen = false;
  }

  static getStubConfig(): Partial<PVPaybackCardConfig> {
    return {
      type: "custom:pv-payback-card",
      show_breakdown: true,
      show_energy_values: true,
      show_money_values: true,
      show_payback_date: true,
      show_progress: true,
      show_contribution_segments: false,
      use_location_seasonality: false,
      annual_discount_rate: 0,
      apply_annual_discount: false,
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("pv-payback-card-editor");
  }

  setConfig(config: PVPaybackCardConfig): void {
    this._comparisonDiscountRate = config.annual_discount_rate ?? 3;
    this._comparisonUsesDefaultRate = config.annual_discount_rate === undefined;
    this._config = withDisplayDefaults(config);
    this._historicalStatistics = undefined;
    this._historicalStatisticsKey = undefined;
    this._calculationCache = undefined;
    this._scenarioCalculationCache = undefined;
  }

  private _historicalStatistics?: HistoricalStatistics;
  private _historicalStatisticsKey?: string;
  private _calculationCache?: { key: string; calculation: Calculation };
  private _scenarioCalculationCache?: { key: string; scenarios: ScenarioCalculations };
  private _comparisonDiscountRate = 3;
  private _comparisonUsesDefaultRate = true;

  protected updated(): void {
    const config = this._config;
    if (
      !config ||
      !this.hass?.callWS ||
      !appliesAnnualDiscount(config) ||
      (config.annual_discount_rate ?? 0) <= 0
    )
      return;
    const completedEnd = calendarDay(new Date());
    completedEnd.setDate(completedEnd.getDate() - 1);
    const key = historicalStatisticsCacheKey(config, dateKey(completedEnd));
    if (this._historicalStatisticsKey === key) return;
    this._historicalStatisticsKey = key;
    loadHistoricalStatistics(this.hass, config)?.then((statistics) => {
      if (statistics && this._historicalStatisticsKey === key) {
        this._historicalStatistics = statistics;
        this.requestUpdate();
      }
    });
  }

  getCardSize(): number {
    return 4;
  }

  private readEnergy(
    config: PVPaybackCardConfig,
    entityId: string,
    messages: { unsupportedUnit: string; entityUnavailable: string; counterRegression: string },
  ): EnergyRead {
    const state = this.hass?.states[entityId];
    const numeric = state ? Number(state.state) : Number.NaN;
    const current = energyToKwh(numeric, state?.attributes?.unit_of_measurement);
    const cached = readCachedEnergy(localStorage, cacheKey(config, entityId));
    const selected = chooseEnergyValue(current, cached);
    if (selected.value !== undefined) {
      if (!selected.cached) {
        const saved = JSON.stringify({
          value: selected.value,
          timestamp: state?.last_updated ?? new Date().toISOString(),
        });
        try {
          localStorage.setItem(cacheKey(config, entityId), saved);
        } catch {
          // Storage can be blocked in privacy-restricted browser contexts.
        }
      }
      return {
        value: selected.value,
        cached: selected.cached,
        timestamp: selected.cached ? cached?.timestamp : state?.last_updated,
        warning: selected.regression ? `${entityId}: ${messages.counterRegression}` : undefined,
      };
    }
    const unit = state?.attributes?.unit_of_measurement;
    return {
      cached: false,
      warning:
        state && !isUnit(unit)
          ? `${entityId}: ${messages.unsupportedUnit}`
          : `${entityId}: ${messages.entityUnavailable}`,
    };
  }

  private text() {
    return translations[
      (this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de")
        ? "de"
        : "en"
    ];
  }
  private formatMoney(value: number): string {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      style: "currency",
      currency: this._config?.currency ?? this.hass?.config?.currency ?? "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  }
  private formatEnergy(value: number): string {
    return (
      new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
        maximumFractionDigits: 0,
      }).format(value) + " kWh"
    );
  }

  private formatDate(date: Date | undefined): string {
    return date
      ? new Intl.DateTimeFormat(this._config?.locale ?? this.hass?.locale?.language, {
          dateStyle: "medium",
        }).format(date)
      : this.text().noProjection;
  }

  private formatPercentage(value: number): string {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      style: "percent",
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

  private openScenarioDialog(): void {
    this._scenarioDialogOpen = true;
  }

  private closeScenarioDialog(): void {
    this._scenarioDialogOpen = false;
  }

  private handleScenarioKeydown(event: KeyboardEvent): void {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.openScenarioDialog();
  }

  private renderScenarioDialog(
    scenarios: ScenarioCalculations,
    locationValid: boolean,
  ): TemplateResult {
    const t = this.text();
    const rows = [
      {
        name: t.scenarioLinear,
        scenario: scenarios.linear,
        icon: "mdi:chart-line",
        className: "scenario-linear",
      },
      {
        name: t.scenarioSeasonal,
        scenario: scenarios.seasonal,
        icon: "mdi:weather-sunny",
        className: "scenario-seasonal",
      },
      {
        name: t.scenarioDiscounted,
        scenario: scenarios.discounted,
        icon: "mdi:percent-circle-outline",
        className: "scenario-discounted",
      },
    ] as const;
    return html`<ha-dialog
      .open=${this._scenarioDialogOpen}
      .heading=${t.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${!locationValid ? html`<p class="scenario-note">${t.locationFallback}</p>` : nothing}
        ${rows.map(
          ({ name, scenario, icon, className }, index) =>
            html`<section class=${`scenario ${className}`}>
              <div class="scenario-heading">
                <ha-icon .icon=${icon}></ha-icon>
                <h3>${name}</h3>
              </div>
              ${
                index === 2
                  ? html`<div class="scenario-rate">
                      ${t.discountRate}: ${this.formatPercentage(this._comparisonDiscountRate)}
                      ${this._comparisonUsesDefaultRate ? html`(${t.defaultRate})` : nothing}
                    </div>`
                  : nothing
              }
              <div class="scenario-values">
                <div>
                  <span>${t.benefit}</span><strong>${this.formatMoney(scenario.benefit)}</strong>
                </div>
                <div>
                  <span>${t.expected}</span
                  ><strong>${this.formatDate(scenario.paybackDate)}</strong>
                </div>
              </div>
            </section>`,
        )}
      </div>
      <ha-button slot="primaryAction" @click=${this.closeScenarioDialog}>${t.close}</ha-button>
    </ha-dialog>`;
  }

  private openMoreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleBreakdownKeydown(event: KeyboardEvent, entityId: string): void {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.openMoreInfo(entityId);
  }

  render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;
    const t = this.text();
    const configError = validConfig(config);
    if (configError)
      return html`<ha-card
        ><div class="content error" role="alert">${t.invalid}: ${configError}</div></ha-card
      >`;
    const self = config.self_consumption_entity
      ? this.readEnergy(config, config.self_consumption_entity, t)
      : undefined;
    const production =
      !self && config.production_energy_entity
        ? this.readEnergy(config, config.production_energy_entity, t)
        : undefined;
    const exported = this.readEnergy(config, config.export_energy_entity, t);
    const sourceReadings = [self, production, exported].filter((reading): reading is EnergyRead =>
      Boolean(reading),
    );
    const selfValue = self?.value;
    const productionValue = production?.value;
    const exportedValue = exported.value;
    if (
      exportedValue === undefined ||
      (self !== undefined && selfValue === undefined) ||
      (production !== undefined && productionValue === undefined)
    )
      return html`<ha-card
        ><div class="content error" role="alert">
          ${t.unavailable}${sourceReadings.map((reading) =>
            reading.warning ? html`<br />${reading.warning}` : nothing,
          )}
        </div></ha-card
      >`;
    const selfConsumptionOrProduction = selfValue ?? productionValue!;
    const now = new Date();
    const location = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude,
    };
    const historicalState = this._historicalStatistics
      ? `loaded:${this._historicalStatisticsKey ?? ""}`
      : `approximation:${this._historicalStatisticsKey ?? ""}`;
    const calculationKey = JSON.stringify([
      config,
      selfConsumptionOrProduction,
      exportedValue,
      dateKey(now),
      location,
      historicalState,
    ]);
    if (this._calculationCache?.key !== calculationKey) {
      this._calculationCache = {
        key: calculationKey,
        calculation: calculatePayback(
          config,
          selfConsumptionOrProduction,
          exportedValue,
          now,
          location,
          dailyEnergyFromStatistics(config, this._historicalStatistics),
        ),
      };
    }
    const calc = this._calculationCache.calculation;
    let scenarios: ScenarioCalculations | undefined;
    if (this._scenarioDialogOpen) {
      const scenarioCalculationKey = `${calculationKey}:${this._comparisonDiscountRate}`;
      if (this._scenarioCalculationCache?.key !== scenarioCalculationKey) {
        this._scenarioCalculationCache = {
          key: scenarioCalculationKey,
          scenarios: calculateScenarioComparisons(
            config,
            selfConsumptionOrProduction,
            exportedValue,
            now,
            location,
            dailyEnergyFromStatistics(config, this._historicalStatistics),
            this._comparisonDiscountRate,
          ),
        };
      }
      scenarios = this._scenarioCalculationCache.scenarios;
    }
    const cached = sourceReadings.some((reading) => reading.cached);
    const cacheTime = sourceReadings
      .map((reading) => reading.timestamp)
      .filter(Boolean)
      .sort()
      .at(0);
    const cacheWarning = cached
      ? `${t.cached}${
          cacheTime
            ? `: ${new Intl.DateTimeFormat(config.locale ?? this.hass?.locale?.language, {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(cacheTime))}`
            : ""
        }${sourceReadings
          .filter((reading) => reading.warning)
          .map((reading) => ` ${reading.warning}`)
          .join("")}`
      : undefined;
    const ownContribution = Math.min(
      100,
      Math.max(0, (calc.ownValue / config.investment_cost) * 100),
    );
    const exportContribution = Math.min(
      Math.max(0, 100 - ownContribution),
      Math.max(0, (calc.exportValue / config.investment_cost) * 100),
    );
    return html`<ha-card>
        <div class="content">
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${config.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${displayName(config.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${
                cacheWarning
                  ? html`<span
                      class="warning-indicator"
                      role="img"
                      aria-label=${cacheWarning}
                      title=${cacheWarning}
                      ><ha-icon icon="mdi:alert"></ha-icon
                    ></span>`
                  : nothing
              }
              ${
                config.show_progress
                  ? html`<span class="header-progress">${calc.progress.toFixed(1)}%</span>`
                  : nothing
              }
            </div>
          </div>
          <div class="benefit">
            <span>${t.benefit}</span
            ><strong
              class="scenario-trigger"
              role="button"
              tabindex="0"
              aria-label=${`${t.scenariosOpen}: ${t.benefit}`}
              @click=${this.openScenarioDialog}
              @keydown=${this.handleScenarioKeydown}
              >${this.formatMoney(calc.benefit)}</strong
            >
          </div>
          ${
            config.show_progress
              ? html`<div
                  class="bar ${config.show_contribution_segments ? "contribution-segments" : ""}"
                  role="progressbar"
                  aria-label=${t.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow=${calc.progress}
                >
                  ${
                    config.show_contribution_segments
                      ? html`<div
                            class="contribution-own"
                            style=${`width:${ownContribution}%`}
                          ></div>
                          <div
                            class="contribution-export"
                            style=${`width:${exportContribution}%`}
                          ></div>`
                      : html`<div style=${`width:${calc.progress}%`}></div>`
                  }
                </div>`
              : nothing
          }
          ${
            config.show_breakdown && (config.show_energy_values || config.show_money_values)
              ? html`<div
                  class="breakdown ${config.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <div
                    class="own"
                    role=${config.self_consumption_entity ? "button" : nothing}
                    tabindex=${config.self_consumption_entity ? "0" : nothing}
                    aria-label=${config.self_consumption_entity ? t.own : nothing}
                    @click=${
                      config.self_consumption_entity
                        ? () => this.openMoreInfo(config.self_consumption_entity!)
                        : nothing
                    }
                    @keydown=${
                      config.self_consumption_entity
                        ? (event: KeyboardEvent) =>
                            this.handleBreakdownKeydown(event, config.self_consumption_entity!)
                        : nothing
                    }
                  >
                    <span>${t.own}</span
                    ><b
                      >${
                        config.show_energy_values && config.show_money_values
                          ? `${this.formatEnergy(calc.selfConsumption)} · ${this.formatMoney(calc.ownValue)}`
                          : config.show_energy_values
                            ? this.formatEnergy(calc.selfConsumption)
                            : this.formatMoney(calc.ownValue)
                      }</b
                    >
                  </div>
                  <div
                    class="export"
                    role="button"
                    tabindex="0"
                    aria-label=${t.export}
                    @click=${() => this.openMoreInfo(config.export_energy_entity)}
                    @keydown=${(event: KeyboardEvent) =>
                      this.handleBreakdownKeydown(event, config.export_energy_entity)}
                  >
                    <span>${t.export}</span
                    ><b
                      >${
                        config.show_energy_values && config.show_money_values
                          ? `${this.formatEnergy(calc.exported)} · ${this.formatMoney(calc.exportValue)}`
                          : config.show_energy_values
                            ? this.formatEnergy(calc.exported)
                            : this.formatMoney(calc.exportValue)
                      }</b
                    >
                  </div>
                </div>`
              : nothing
          }
          ${
            config.show_payback_date
              ? html`<div class="date">
                  <span>${t.expected}</span
                  ><b
                    class="scenario-trigger"
                    role="button"
                    tabindex="0"
                    aria-label=${`${t.scenariosOpen}: ${t.expected}`}
                    @click=${this.openScenarioDialog}
                    @keydown=${this.handleScenarioKeydown}
                    >${this.formatDate(calc.paybackDate)}</b
                  >
                </div>`
              : nothing
          }
        </div>
      </ha-card>
      ${
        this._scenarioDialogOpen && scenarios
          ? this.renderScenarioDialog(
              scenarios,
              validLocation(location.latitude, location.longitude),
            )
          : nothing
      }`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .content {
      padding: 16px;
      color: var(--primary-text-color);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.1em;
      font-weight: 600;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .header-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .header-progress {
      color: var(--primary-color);
      font-size: 1.545em;
      white-space: nowrap;
    }
    ha-icon {
      color: var(--primary-color);
    }
    .warning-indicator {
      display: inline-flex;
      color: var(--warning-color, #ff9800);
    }
    .warning-indicator ha-icon {
      color: inherit;
    }
    .benefit {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin: 22px 0 12px;
    }
    .benefit strong {
      font-size: 1.7em;
    }
    .scenario-trigger {
      border-radius: 4px;
      cursor: pointer;
    }
    .scenario-trigger:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 4px;
    }
    .date {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin: 12px 0 6px;
    }
    .bar {
      height: 10px;
      background: var(--secondary-background-color);
      border-radius: 99px;
      overflow: hidden;
    }
    .bar div {
      height: 100%;
      background: linear-gradient(
        90deg,
        var(--info-color, #03a9f4) 0%,
        var(--success-color, #4caf50) 100%
      );
      border-radius: inherit;
      transition: width 0.2s;
    }
    .bar.contribution-segments {
      display: flex;
    }
    .bar.contribution-segments div {
      flex-shrink: 0;
      border-radius: 0;
    }
    .bar.contribution-segments .contribution-own {
      background: var(--info-color, #03a9f4);
      border-radius: 99px 0 0 99px;
    }
    .bar.contribution-segments .contribution-export {
      background: var(--success-color, #4caf50);
      border-radius: 0 99px 99px 0;
    }
    .breakdown {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 18px;
    }
    .breakdown div {
      display: grid;
      gap: 4px;
    }
    .breakdown span,
    .date span,
    .benefit span {
      color: var(--secondary-text-color);
    }
    .breakdown b {
      font-size: 0.92em;
    }
    .breakdown div[role="button"] {
      cursor: pointer;
    }
    .breakdown div[role="button"]:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 4px;
      border-radius: 4px;
    }
    .breakdown.contribution-segments .own,
    .breakdown.contribution-segments .own span,
    .breakdown.contribution-segments .own b {
      color: var(--info-color, #03a9f4);
    }
    .breakdown.contribution-segments .export,
    .breakdown.contribution-segments .export span,
    .breakdown.contribution-segments .export b {
      color: var(--success-color, #4caf50);
    }
    .date {
      align-items: start;
      margin-top: 18px;
    }
    .date b {
      text-align: end;
    }
    .error {
      margin-top: 16px;
      color: var(--warning-color);
      font-size: 0.88em;
    }
    .scenario-dialog {
      display: grid;
      gap: 12px;
      min-width: min(520px, 75vw);
      padding-bottom: 8px;
    }
    .scenario {
      --scenario-color: var(--secondary-text-color, #727272);
      padding: 14px;
      border: 2px solid var(--scenario-color);
      background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--scenario-color) 12%, var(--card-background-color, #fff));
      border-radius: 12px;
    }
    .scenario-seasonal {
      --scenario-color: var(--success-color, #4caf50);
    }
    .scenario-discounted {
      --scenario-color: var(--info-color, #03a9f4);
    }
    .scenario-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .scenario-heading ha-icon {
      color: var(--scenario-color);
    }
    .scenario h3 {
      margin: 0;
      font-size: 1em;
    }
    .scenario-rate,
    .scenario-note,
    .scenario-values span {
      color: var(--secondary-text-color);
    }
    .scenario-note {
      margin: 0;
    }
    .scenario-rate {
      margin: -4px 0 10px;
      font-size: 0.88em;
    }
    .scenario-values {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .scenario-values div {
      display: grid;
      gap: 4px;
    }
    .scenario-values strong:last-child {
      text-align: end;
    }
    @media (max-width: 360px) {
      .breakdown {
        grid-template-columns: 1fr;
      }
      .date,
      .benefit {
        align-items: start;
        flex-direction: column;
        gap: 4px;
      }
      .date b {
        text-align: start;
      }
      .scenario-dialog {
        min-width: 0;
      }
      .scenario-values {
        grid-template-columns: 1fr;
      }
      .scenario-values strong:last-child {
        text-align: start;
      }
    }
  `;
}

customElements.define("pv-payback-card", PVPaybackCard);

declare global {
  interface HTMLElementTagNameMap {
    "pv-payback-card": PVPaybackCard;
    "pv-payback-card-editor": PVPaybackCardEditor;
  }
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors.",
});
