import { describe, expect, it } from "vitest";
import {
  PVPaybackCard,
  appliesAnnualDiscount,
  cacheKey,
  calendarDuration,
  calculatePayback,
  calculateScenarioComparisons,
  calculateSeasonalPaybackDate,
  displayName,
  energyToKwh,
  withDisplayDefaults,
  type PVPaybackCardConfig,
} from "../src/pv-payback-card";

if (!customElements.get("ha-entity-picker")) {
  customElements.define("ha-entity-picker", class extends HTMLElement {});
}

const config: PVPaybackCardConfig = {
  type: "custom:pv-payback-card",
  start_date: "2026-01-01",
  investment_cost: 10_000,
  electricity_price: 0.3,
  feed_in_tariff: 0.08,
  self_consumption_entity: "sensor.own",
  export_energy_entity: "sensor.export",
};

describe("calendarDuration", () => {
  it("keeps years, months, and remaining days", () => {
    expect(calendarDuration(new Date(2026, 1, 10), new Date(2028, 4, 31))).toEqual({
      years: 2,
      months: 3,
      days: 21,
    });
  });

  it("handles the end of February and leap years", () => {
    expect(calendarDuration(new Date(2024, 0, 31), new Date(2024, 1, 29))).toEqual({
      years: 0,
      months: 1,
      days: 0,
    });
    expect(calendarDuration(new Date(2024, 1, 29), new Date(2025, 1, 28))).toEqual({
      years: 1,
      months: 0,
      days: 0,
    });
  });

  it("counts calendar days across a daylight-saving change", () => {
    expect(calendarDuration(new Date(2026, 2, 28), new Date(2026, 2, 30))).toEqual({
      years: 0,
      months: 0,
      days: 2,
    });
  });
});

describe("energyToKwh", () => {
  it("converts supported cumulative energy units", () => {
    expect(energyToKwh(500, "Wh")).toBe(0.5);
    expect(energyToKwh(2, "kWh")).toBe(2);
    expect(energyToKwh(1.5, "MWh")).toBe(1500);
  });

  it("rejects unsupported units and values", () => {
    expect(energyToKwh(1, "W")).toBeUndefined();
    expect(energyToKwh(Number.NaN, "kWh")).toBeUndefined();
  });
});

describe("calculatePayback", () => {
  it("uses energy values, tariffs, and baselines", () => {
    const result = calculatePayback(
      { ...config, self_consumption_baseline: 100, export_energy_baseline: 50 },
      1100,
      550,
      new Date("2026-01-11T00:00:00"),
    );
    expect(result.selfConsumption).toBe(1000);
    expect(result.exported).toBe(500);
    expect(result.benefit).toBe(340);
    expect(result.progress).toBeCloseTo(3.4);
    expect(result.paybackDate?.toISOString().slice(0, 10)).toBe("2026-10-22");
  });

  it("always avoids negative contribution after a counter reset", () => {
    const result = calculatePayback(
      { ...config, self_consumption_baseline: 100, export_energy_baseline: 50 },
      20,
      10,
    );
    expect(result.selfConsumption).toBe(0);
    expect(result.exported).toBe(0);
    expect(result.paybackDate).toBeUndefined();
  });

  it("keeps nominal results exactly when the discount rate is zero", () => {
    const now = new Date("2026-03-01T00:00:00");
    const nominal = calculatePayback(config, 1100, 550, now);
    const zeroRate = calculatePayback(
      { ...config, annual_discount_rate: 0, apply_annual_discount: true },
      1100,
      550,
      now,
    );
    expect(zeroRate).toEqual(nominal);
  });

  it("reduces past benefit with a positive annual discount rate", () => {
    const now = new Date("2030-01-01T00:00:00");
    const nominal = calculatePayback(config, 20_000, 10_000, now);
    const discounted = calculatePayback(
      { ...config, annual_discount_rate: 10, apply_annual_discount: true },
      20_000,
      10_000,
      now,
    );
    expect(discounted.benefit).toBeLessThan(nominal.benefit);
    expect(discounted.progress).toBeLessThan(nominal.progress);
  });

  it("keeps the main calculation nominal until discounting is enabled", () => {
    const now = new Date("2030-01-01T00:00:00");
    const nominal = calculatePayback(config, 20_000, 10_000, now);
    const disabled = calculatePayback(
      { ...config, annual_discount_rate: 10, apply_annual_discount: false },
      20_000,
      10_000,
      now,
    );

    expect(disabled).toEqual(nominal);
  });

  it("delays or prevents a discounted payback date", () => {
    const now = new Date("2028-01-01T00:00:00");
    const nominal = calculatePayback(config, 10_000, 5_000, now);
    const discounted = calculatePayback(
      { ...config, annual_discount_rate: 5, apply_annual_discount: true },
      10_000,
      5_000,
      now,
    );
    expect(discounted.paybackDate).toBeDefined();
    expect(discounted.paybackDate!.getTime()).toBeGreaterThanOrEqual(
      nominal.paybackDate?.getTime() ?? 0,
    );
    const impossible = calculatePayback(
      {
        ...config,
        annual_discount_rate: 100,
        apply_annual_discount: true,
        investment_cost: 1_000_000,
      },
      10_000,
      5_000,
      now,
    );
    expect(impossible.paybackDate).toBeUndefined();
  });

  it("keeps the complete discounted historical benefit after payback", () => {
    const result = calculatePayback(
      {
        ...config,
        investment_cost: 100,
        annual_discount_rate: 5,
        apply_annual_discount: true,
      },
      1000,
      500,
      new Date("2027-01-01T00:00:00"),
    );
    expect(result.paybackDate).toBeDefined();
    expect(result.benefit).toBeGreaterThan(300);
    expect(result.benefit).toBe(result.ownValue + result.exportValue);
  });

  it("keeps the linear forecast when location seasonality is disabled", () => {
    const now = new Date("2026-06-01T00:00:00");
    const linear = calculatePayback(config, 1100, 550, now);
    const disabled = calculatePayback(
      { ...config, use_location_seasonality: false },
      1100,
      550,
      now,
      { latitude: 52.52, longitude: 13.405 },
    );

    expect(disabled.paybackDate?.getTime()).toBe(linear.paybackDate?.getTime());
  });

  it("falls back to the linear forecast for an invalid Home Assistant location", () => {
    const now = new Date("2026-06-01T00:00:00");
    const linear = calculatePayback(config, 1100, 550, now);
    const invalidLocation = calculatePayback(
      { ...config, use_location_seasonality: true },
      1100,
      550,
      now,
      { latitude: 91, longitude: 13.405 },
    );

    expect(invalidLocation.paybackDate?.getTime()).toBe(linear.paybackDate?.getTime());
  });
});

describe("calculateSeasonalPaybackDate", () => {
  it("returns the estimated historical payback day for an amortized installation", () => {
    const now = new Date("2026-07-31T12:00:00");
    const result = calculateSeasonalPaybackDate("2026-01-01", now, 12_000, 10_000, 52.52);

    expect(result).toBeDefined();
    expect(result!.getTime()).toBeLessThan(now.getTime());
    expect(result!.getTime()).toBeGreaterThanOrEqual(new Date("2026-01-01").getTime());
  });

  it("changes the forecast for observations from different seasons", () => {
    const winter = calculateSeasonalPaybackDate(
      "2025-11-01",
      new Date("2026-01-31T12:00:00"),
      400,
      10_000,
      52.52,
    );
    const summer = calculateSeasonalPaybackDate(
      "2025-05-01",
      new Date("2025-07-31T12:00:00"),
      400,
      10_000,
      52.52,
    );

    expect(winter).toBeDefined();
    expect(summer).toBeDefined();
    expect(winter!.getTime()).toBeLessThan(summer!.getTime());
  });

  it("uses opposite seasonal patterns for northern and southern latitudes", () => {
    const northern = calculateSeasonalPaybackDate(
      "2025-11-01",
      new Date("2026-01-31T12:00:00"),
      400,
      10_000,
      52.52,
    );
    const southern = calculateSeasonalPaybackDate(
      "2025-11-01",
      new Date("2026-01-31T12:00:00"),
      400,
      10_000,
      -52.52,
    );

    expect(northern).toBeDefined();
    expect(southern).toBeDefined();
    expect(northern!.getTime()).toBeLessThan(southern!.getTime());
  });
});

describe("scenario comparison", () => {
  it("calculates every scenario independently from the selected card options", () => {
    const scenarios = calculateScenarioComparisons(
      {
        ...config,
        use_location_seasonality: false,
        annual_discount_rate: 5,
        apply_annual_discount: false,
      },
      10_000,
      5_000,
      new Date("2028-01-01T00:00:00"),
      { latitude: 52.52, longitude: 13.405 },
    );

    expect(scenarios.linear.benefit).toBe(scenarios.seasonal.benefit);
    expect(scenarios.linear.paybackDate?.getTime()).not.toBe(
      scenarios.seasonal.paybackDate?.getTime(),
    );
    expect(scenarios.discounted.benefit).toBeLessThan(scenarios.seasonal.benefit);
  });

  it("uses three percent for the comparison when no discount rate is configured", () => {
    const now = new Date("2028-01-01T00:00:00");
    const scenarios = calculateScenarioComparisons(config, 10_000, 5_000, now, {
      latitude: 52.52,
      longitude: 13.405,
    });

    expect(scenarios.discounted.benefit).toBeLessThan(scenarios.seasonal.benefit);
    expect(calculatePayback(config, 10_000, 5_000, now).benefit).toBe(scenarios.seasonal.benefit);
  });
});

describe("production-based self-consumption", () => {
  const productionConfig: PVPaybackCardConfig = {
    ...config,
    self_consumption_entity: undefined,
    production_energy_entity: "sensor.production",
  };

  it("calculates self-consumption from production minus export", () => {
    const result = calculatePayback(productionConfig, 1100, 550);
    expect(result.selfConsumption).toBe(550);
    expect(result.ownValue).toBe(165);
  });

  it("applies production and export baselines before deriving self-consumption", () => {
    const result = calculatePayback(
      {
        ...productionConfig,
        production_energy_baseline: 100,
        export_energy_baseline: 50,
      },
      1100,
      550,
    );

    expect(result.selfConsumption).toBe(500);
    expect(result.exported).toBe(500);
  });

  it("carries production from a replaced counter through a negative baseline", () => {
    const result = calculatePayback(
      { ...productionConfig, production_energy_baseline: -20_000 },
      650,
      100,
    );

    expect(result.selfConsumption).toBe(20_550);
    expect(result.exported).toBe(100);
  });

  it("carries direct self-consumption through a negative baseline", () => {
    const result = calculatePayback(
      {
        ...config,
        self_consumption_baseline: -20_000,
        export_energy_baseline: -5_000,
      },
      650,
      100,
    );

    expect(result.selfConsumption).toBe(20_650);
    expect(result.exported).toBe(5_100);
  });

  it("uses a separate cache scope for production-based input", () => {
    expect(cacheKey(config, config.export_energy_entity)).not.toBe(
      cacheKey(productionConfig, productionConfig.export_energy_entity),
    );
  });

  it("uses a separate cache scope when the production baseline changes", () => {
    expect(cacheKey(productionConfig, productionConfig.production_energy_entity!)).not.toBe(
      cacheKey(
        { ...productionConfig, production_energy_baseline: 100 },
        productionConfig.production_energy_entity!,
      ),
    );
  });

  it("does not make derived self-consumption clickable", async () => {
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.hass = {
      states: {
        "sensor.production": { state: "1100", attributes: { unit_of_measurement: "kWh" } },
        "sensor.export": { state: "550", attributes: { unit_of_measurement: "kWh" } },
      },
      locale: { language: "en" },
    };
    card.setConfig(productionConfig);
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".own")?.tagName).toBe("BUTTON");
    expect((card.shadowRoot?.querySelector(".own") as HTMLButtonElement).disabled).toBe(true);
    expect(card.shadowRoot?.querySelector(".export")?.tagName).toBe("BUTTON");
  });

  it("prefers direct self-consumption when both input models are configured", async () => {
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.hass = {
      states: {
        "sensor.own": { state: "1100", attributes: { unit_of_measurement: "kWh" } },
        "sensor.production": { state: "9999", attributes: { unit_of_measurement: "kWh" } },
        "sensor.export": { state: "550", attributes: { unit_of_measurement: "kWh" } },
      },
      locale: { language: "en" },
    };
    card.setConfig({ ...productionConfig, self_consumption_entity: "sensor.own" });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".own b")?.textContent).toContain("1,100 kWh");
  });
});

describe("display configuration", () => {
  it("uses the localized title for the former generated card name", () => {
    expect(displayName("PV-Amortisation", "Amortisation der PV-Anlage")).toBe(
      "Amortisation der PV-Anlage",
    );
    expect(displayName("PV-Amortisation", "Solar payback")).toBe("Solar payback");
    expect(displayName("PV payback", "Solar payback")).toBe("Solar payback");
  });

  it("preserves an explicitly configured card name", () => {
    expect(displayName("My solar investment", "Solar payback")).toBe("My solar investment");
  });

  it("enables detailed energy and monetary values by default", () => {
    expect(withDisplayDefaults(config)).toMatchObject({
      display_style: "full",
      payback_date_format: "absolute",
      payback_date_relative_reference: "now",
      show_breakdown: true,
      show_energy_values: true,
      show_money_values: true,
      show_payback_date: true,
      show_progress: true,
      use_location_seasonality: false,
      annual_discount_rate: 0,
      apply_annual_discount: false,
    });
  });

  it("preserves explicitly disabled detailed values", () => {
    expect(
      withDisplayDefaults({ ...config, show_energy_values: false, show_money_values: false }),
    ).toMatchObject({ show_energy_values: false, show_money_values: false });
  });

  it("keeps the former statistics option as a compatibility alias", () => {
    const legacy = { ...config, use_historical_statistics: true };

    expect(appliesAnnualDiscount(legacy)).toBe(true);
    expect(withDisplayDefaults(legacy).apply_annual_discount).toBe(true);
  });
});
