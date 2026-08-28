import { afterEach, describe, expect, it } from "vitest";
import {
  PVPaybackCardEditor,
  PVPaybackCard,
  cacheKey,
  calculatePayback,
  chooseEnergyValue,
  displayName,
  energyToKwh,
  parseCachedEnergy,
  readCachedEnergy,
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
});

describe("production-based self-consumption", () => {
  const productionConfig: PVPaybackCardConfig = {
    ...config,
    self_consumption_entity: undefined,
    production_energy_entity: "sensor.production",
  };

  it("calculates self-consumption from production minus export", () => {
    const result = calculatePayback(productionConfig, 1100 - 550, 550);
    expect(result.selfConsumption).toBe(550);
    expect(result.ownValue).toBe(165);
  });

  it("uses a separate cache scope for production-based input", () => {
    expect(cacheKey(config, config.export_energy_entity)).not.toBe(
      cacheKey(productionConfig, productionConfig.export_energy_entity),
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
    });
  });

  it("preserves explicitly disabled detailed values", () => {
    expect(
      withDisplayDefaults({ ...config, show_energy_values: false, show_money_values: false }),
    ).toMatchObject({ show_energy_values: false, show_money_values: false });
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
    expect(editor.shadowRoot?.querySelectorAll("label")).toHaveLength(12);
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
