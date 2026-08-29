import { afterEach, describe, expect, it } from "vitest";
import {
  PVPaybackCardEditor,
  PVPaybackCard,
  appliesAnnualDiscount,
  cacheKey,
  calculatePayback,
  calculateScenarioComparisons,
  calculateSeasonalPaybackDate,
  chooseEnergyValue,
  dailyEnergyFromStatistics,
  displayName,
  energyToKwh,
  loadHistoricalStatistics,
  parseCachedEnergy,
  readCachedEnergy,
  statisticDailyDeltas,
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

    expect(card.shadowRoot?.querySelector(".own")?.getAttribute("role")).toBeNull();
    expect(card.shadowRoot?.querySelector(".export")?.getAttribute("role")).toBe("button");
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
    expect(displayName("PV-Amortisation", "PV payback")).toBe("PV payback");
  });

  it("preserves an explicitly configured card name", () => {
    expect(displayName("My solar investment", "PV payback")).toBe("My solar investment");
  });

  it("enables detailed energy and monetary values by default", () => {
    expect(withDisplayDefaults(config)).toMatchObject({
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

describe("historical daily statistics", () => {
  it("forms defensive deltas from cumulative daily sums", () => {
    expect([
      ...statisticDailyDeltas([
        { start: "2026-01-01T00:00:00", sum: 10 },
        { start: "2026-01-02T00:00:00", sum: 15 },
        { start: "2026-01-03T00:00:00", sum: 12 },
        { start: "2026-01-04T00:00:00", sum: 20 },
      ]),
    ]).toEqual([
      ["2026-01-02", 5],
      ["2026-01-04", 8],
    ]);
  });

  it("accepts numeric Home Assistant statistic timestamps", () => {
    expect([
      ...statisticDailyDeltas([
        { start: new Date("2026-01-01T00:00:00").getTime(), sum: 10 },
        { start: new Date("2026-01-02T00:00:00").getTime(), sum: 13 },
      ]),
    ]).toEqual([["2026-01-02", 3]]);
  });

  it("supports direct and production-derived input models", () => {
    const direct = dailyEnergyFromStatistics(config, {
      "sensor.own": [
        { start: "2026-01-01T00:00:00", sum: 1 },
        { start: "2026-01-02T00:00:00", sum: 4 },
      ],
      "sensor.export": [
        { start: "2026-01-01T00:00:00", sum: 2 },
        { start: "2026-01-02T00:00:00", sum: 3 },
      ],
    });
    expect(direct).toEqual([{ date: "2026-01-02", selfConsumption: 3, exported: 1 }]);
    const derived = dailyEnergyFromStatistics(
      {
        ...config,
        self_consumption_entity: undefined,
        production_energy_entity: "sensor.production",
      },
      {
        "sensor.production": [
          { start: "2026-01-01T00:00:00", sum: 2 },
          { start: "2026-01-02T00:00:00", sum: 7 },
        ],
        "sensor.export": [
          { start: "2026-01-01T00:00:00", sum: 1 },
          { start: "2026-01-02T00:00:00", sum: 3 },
        ],
      },
    );
    expect(derived).toEqual([{ date: "2026-01-02", selfConsumption: 3, exported: 2 }]);
  });

  it("deduplicates WebSocket requests and retains the fallback after failure", async () => {
    const successConfig = {
      ...config,
      start_date: "2024-01-01",
      annual_discount_rate: 3,
      apply_annual_discount: true,
    };
    let calls = 0;
    const hass = {
      callWS: async () => {
        calls += 1;
        return {};
      },
    };
    const first = loadHistoricalStatistics(hass, successConfig, new Date("2026-01-03T12:00:00"));
    const second = loadHistoricalStatistics(hass, successConfig, new Date("2026-01-03T12:00:00"));
    expect(first).toBe(second);
    await first;
    expect(calls).toBe(1);

    let failures = 0;
    const failingHass = {
      callWS: async () => {
        failures += 1;
        return Promise.reject(new Error("recorder unavailable"));
      },
    };
    const failed = loadHistoricalStatistics(
      failingHass,
      { ...successConfig, start_date: "2024-02-01" },
      new Date("2026-01-03T12:00:00"),
    );
    expect(await failed).toBeUndefined();
    expect(
      await loadHistoricalStatistics(
        failingHass,
        { ...successConfig, start_date: "2024-02-01" },
        new Date("2026-01-03T12:00:00"),
      ),
    ).toBeUndefined();
    expect(failures).toBe(1);
  });

  it("requests a comparison day and includes the last completed day", async () => {
    const requests: Record<string, unknown>[] = [];
    await loadHistoricalStatistics(
      {
        callWS: async (request) => {
          requests.push(request);
          return {};
        },
      },
      {
        ...config,
        start_date: "2026-05-02",
        annual_discount_rate: 3,
        apply_annual_discount: true,
      },
      new Date("2026-05-05T12:00:00"),
    );
    expect(requests).toEqual([
      {
        type: "recorder/statistics_during_period",
        start_time: "2026-05-01T00:00:00",
        end_time: "2026-05-05T00:00:00",
        statistic_ids: ["sensor.own", "sensor.export"],
        period: "day",
        types: ["sum"],
      },
    ]);
  });
});

describe("last valid energy cache", () => {
  it("uses a persisted value when the current entity is unavailable after reload", () => {
    const cached = parseCachedEnergy('{"value":123.4,"timestamp":"2026-01-10T12:00:00Z"}');
    expect(chooseEnergyValue(undefined, cached)).toEqual({
      value: 123.4,
      cached: true,
      regression: false,
    });
  });

  it("ignores corrupted cache values and storage access failures", () => {
    expect(parseCachedEnergy("not json")).toBeUndefined();
    expect(parseCachedEnergy('{"value":-1}')).toBeUndefined();
    const blockedStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
    } as Pick<Storage, "getItem">;
    expect(readCachedEnergy(blockedStorage, "test")).toBeUndefined();
  });

  it("retains the higher cached value after a counter regression", () => {
    expect(chooseEnergyValue(90, { value: 100, timestamp: "2026-01-10T12:00:00Z" })).toEqual({
      value: 100,
      cached: true,
      regression: true,
    });
    expect(chooseEnergyValue(101, { value: 100 })).toEqual({
      value: 101,
      cached: false,
      regression: false,
    });
  });

  it("starts a separate cache scope when accounting inputs change", () => {
    const changed = { ...config, start_date: "2026-02-01", self_consumption_baseline: 5 };
    expect(cacheKey(config, config.self_consumption_entity!)).not.toBe(
      cacheKey(changed, changed.self_consumption_entity!),
    );
  });
});

describe("scenario dialog", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  async function createCard(language: "de" | "en" = "en"): Promise<PVPaybackCard> {
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.hass = {
      states: {
        "sensor.own": { state: "10000", attributes: { unit_of_measurement: "kWh" } },
        "sensor.export": { state: "5000", attributes: { unit_of_measurement: "kWh" } },
      },
      locale: { language },
      config: { currency: "EUR", latitude: 52.52, longitude: 13.405 },
    };
    card.setConfig({ ...config, annual_discount_rate: 5 });
    document.body.append(card);
    await card.updateComplete;
    return card;
  }

  it("opens the English comparison from the benefit value", async () => {
    const card = await createCard();

    (card.shadowRoot?.querySelector(".benefit strong") as HTMLElement).click();
    await card.updateComplete;

    const dialog = card.shadowRoot?.querySelector("ha-dialog") as HTMLElement & {
      heading?: string;
      open?: boolean;
    };
    expect(dialog.open).toBe(true);
    expect(dialog.heading).toBe("Payback scenarios");
    expect(dialog.textContent).toContain("Linear only");
    expect(dialog.textContent).toContain("With seasonality");
    expect(dialog.textContent).toContain("With seasonality and discounting");
    expect(dialog.textContent).toContain("Discount rate: 5%");
    const scenarios = Array.from(dialog.querySelectorAll(".scenario"));
    expect(scenarios.map((scenario) => scenario.className)).toEqual([
      "scenario scenario-linear",
      "scenario scenario-seasonal",
      "scenario scenario-discounted",
    ]);
    expect(
      scenarios.map(
        (scenario) => (scenario.querySelector("ha-icon") as HTMLElement & { icon?: string }).icon,
      ),
    ).toEqual(["mdi:chart-line", "mdi:weather-sunny", "mdi:percent-circle-outline"]);
  });

  it("opens the localized comparison from the payback date", async () => {
    const card = await createCard("de");

    (card.shadowRoot?.querySelector(".date b") as HTMLElement).click();
    await card.updateComplete;

    const dialog = card.shadowRoot?.querySelector("ha-dialog") as HTMLElement & {
      heading?: string;
    };
    expect(dialog.heading).toBe("Amortisationsszenarien");
    expect(dialog.textContent).toContain("Nur linear");
    expect(dialog.textContent).toContain("Mit Saisonalität");
    expect(dialog.textContent).toContain("Mit Saisonalität und Abzinsung");
    expect(dialog.textContent).toMatch(/Abzinsungssatz: 5\s*%/);
  });

  it("labels the default comparison discount rate", async () => {
    const card = await createCard();
    card.setConfig(config);
    await card.updateComplete;

    (card.shadowRoot?.querySelector(".benefit strong") as HTMLElement).click();
    await card.updateComplete;

    const text = card.shadowRoot?.querySelector("ha-dialog")?.textContent?.replace(/\s+/g, " ");
    expect(text).toContain("Discount rate: 3% (default)");
  });
});

describe("configuration editor", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  async function createEditor(): Promise<PVPaybackCardEditor> {
    const editor = document.createElement("pv-payback-card-editor") as PVPaybackCardEditor;
    editor.hass = { states: {}, locale: { language: "en" } };
    document.body.append(editor);
    await editor.updateComplete;
    return editor;
  }

  it("renders values after Home Assistant sets the configuration late", async () => {
    const editor = await createEditor();

    editor.setConfig(config);
    await editor.updateComplete;

    expect(
      (editor.shadowRoot?.querySelector('[name="investment_cost"]') as HTMLInputElement).value,
    ).toBe("10000");
    expect(
      (editor.shadowRoot?.querySelector('[name="start_date"]') as HTMLInputElement).value,
    ).toBe("2026-01-01");
  });

  it("disables location seasonality by default", async () => {
    const editor = await createEditor();

    editor.setConfig(config);
    await editor.updateComplete;

    expect(
      (editor.shadowRoot?.querySelector('[name="use_location_seasonality"]') as HTMLInputElement)
        .checked,
    ).toBe(false);
  });

  it("passes the configured entity values to each picker", async () => {
    const editor = await createEditor();

    editor.setConfig(config);
    await editor.updateComplete;

    const pickers = Array.from(
      editor.shadowRoot?.querySelectorAll("ha-entity-picker") ?? [],
    ) as Array<HTMLElement & { value?: string }>;
    expect(pickers).toHaveLength(3);
    expect(pickers.map((picker) => picker.value)).toEqual([
      config.self_consumption_entity,
      "",
      config.export_energy_entity,
    ]);
  });

  it("shows the baseline for the selected energy input model", async () => {
    const editor = await createEditor();

    editor.setConfig(config);
    await editor.updateComplete;
    expect(editor.shadowRoot?.querySelector('[name="self_consumption_baseline"]')).not.toBeNull();
    expect(editor.shadowRoot?.querySelector('[name="production_energy_baseline"]')).toBeNull();

    editor.setConfig({
      ...config,
      self_consumption_entity: undefined,
      production_energy_entity: "sensor.production",
    });
    await editor.updateComplete;
    expect(editor.shadowRoot?.querySelector('[name="self_consumption_baseline"]')).toBeNull();
    expect(editor.shadowRoot?.querySelector('[name="production_energy_baseline"]')).not.toBeNull();
  });

  it("uses each entity label only inside its picker", async () => {
    const editor = await createEditor();

    editor.setConfig(config);
    await editor.updateComplete;

    const pickers = Array.from(
      editor.shadowRoot?.querySelectorAll("ha-entity-picker") ?? [],
    ) as Array<HTMLElement & { label?: string }>;
    expect(pickers.map((picker) => picker.label)).toEqual([
      "Self-consumption energy entity",
      "PV production energy entity",
      "Export energy entity",
    ]);
    expect(editor.shadowRoot?.querySelectorAll("label")).toHaveLength(15);
  });

  it("emits the complete configuration after an entity changes", async () => {
    const editor = await createEditor();
    const changes: Partial<PVPaybackCardConfig>[] = [];
    editor.addEventListener("config-changed", (event) => {
      changes.push((event as CustomEvent<{ config: Partial<PVPaybackCardConfig> }>).detail.config);
    });

    editor.setConfig(config);
    await editor.updateComplete;
    editor.shadowRoot
      ?.querySelector("ha-entity-picker")
      ?.dispatchEvent(
        new CustomEvent("value-changed", { detail: { value: "sensor.updated_self" } }),
      );

    expect(changes).toEqual([{ ...config, self_consumption_entity: "sensor.updated_self" }]);
  });
});
