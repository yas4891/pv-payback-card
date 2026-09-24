import { afterEach, describe, expect, it } from "vitest";
import "../src/pv-payback-card";
import type { PVPaybackCardConfig, PVPaybackCardEditor } from "../src/pv-payback-card";

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

  it("selects the full display style by default and preserves compact", async () => {
    const editor = await createEditor();

    editor.setConfig(config);
    await editor.updateComplete;
    expect(
      (editor.shadowRoot?.querySelector('[name="display_style"]') as HTMLSelectElement).value,
    ).toBe("full");

    editor.setConfig({ ...config, display_style: "compact" });
    await editor.updateComplete;
    expect(
      (editor.shadowRoot?.querySelector('[name="display_style"]') as HTMLSelectElement).value,
    ).toBe("compact");
  });

  it("shows the relative reference only when relative dates are selected", async () => {
    const editor = await createEditor();
    editor.setConfig({ ...config, self_consumption_entity: "sensor.own" });
    await editor.updateComplete;
    expect(
      (editor.shadowRoot?.querySelector('[name="payback_date_format"]') as HTMLSelectElement).value,
    ).toBe("absolute");
    expect(editor.shadowRoot?.querySelector('[name="payback_date_relative_reference"]')).toBeNull();

    editor.setConfig({
      ...config,
      payback_date_format: "relative",
      payback_date_relative_reference: "start_date",
    });
    await editor.updateComplete;
    expect(
      (
        editor.shadowRoot?.querySelector(
          '[name="payback_date_relative_reference"]',
        ) as HTMLSelectElement
      ).value,
    ).toBe("start_date");
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
      "",
      config.export_energy_entity,
      config.self_consumption_entity,
    ]);
  });

  it("keeps production inputs standard and direct self-consumption advanced", async () => {
    const editor = await createEditor();

    editor.setConfig(config);
    await editor.updateComplete;
    expect(
      editor.shadowRoot?.querySelector(".advanced-toggle")?.getAttribute("aria-expanded"),
    ).toBe("true");
    expect(editor.shadowRoot?.querySelector('[name="self_consumption_baseline"]')).not.toBeNull();
    expect(editor.shadowRoot?.querySelector('[name="production_energy_baseline"]')).not.toBeNull();

    const standardEditor = await createEditor();
    standardEditor.setConfig({
      ...config,
      self_consumption_entity: undefined,
      production_energy_entity: "sensor.production",
    });
    await standardEditor.updateComplete;
    expect(
      standardEditor.shadowRoot?.querySelector(".advanced-toggle")?.getAttribute("aria-expanded"),
    ).toBe("false");
    expect(
      standardEditor.shadowRoot?.querySelector('[name="self_consumption_baseline"]'),
    ).toBeNull();
    expect(
      standardEditor.shadowRoot?.querySelector('[name="production_energy_baseline"]'),
    ).not.toBeNull();
  });

  it("opens advanced settings on demand", async () => {
    const editor = await createEditor();
    editor.setConfig({
      ...config,
      self_consumption_entity: undefined,
      production_energy_entity: "sensor.production",
    });
    await editor.updateComplete;

    (editor.shadowRoot?.querySelector(".advanced-toggle") as HTMLButtonElement).click();
    await editor.updateComplete;

    expect(
      editor.shadowRoot?.querySelector(".advanced-toggle")?.getAttribute("aria-expanded"),
    ).toBe("true");
    expect(
      Array.from(editor.shadowRoot?.querySelectorAll("ha-entity-picker") ?? []).some(
        (picker) =>
          (picker as HTMLElement & { label?: string }).label === "Self-consumption energy entity",
      ),
    ).toBe(true);
    expect(editor.shadowRoot?.querySelector('[name="use_location_seasonality"]')).not.toBeNull();
  });

  it("uses each entity label only inside its picker", async () => {
    const editor = await createEditor();

    editor.setConfig(config);
    await editor.updateComplete;

    const pickers = Array.from(
      editor.shadowRoot?.querySelectorAll("ha-entity-picker") ?? [],
    ) as Array<HTMLElement & { label?: string }>;
    expect(pickers.map((picker) => picker.label)).toEqual([
      "PV production energy entity",
      "Export energy entity",
      "Self-consumption energy entity",
    ]);
    expect(editor.shadowRoot?.querySelectorAll("label")).toHaveLength(18);
  });

  it("emits the complete configuration after an entity changes", async () => {
    const editor = await createEditor();
    const changes: Partial<PVPaybackCardConfig>[] = [];
    editor.addEventListener("config-changed", (event) => {
      changes.push((event as CustomEvent<{ config: Partial<PVPaybackCardConfig> }>).detail.config);
    });

    editor.setConfig(config);
    await editor.updateComplete;
    const selfConsumptionPicker = Array.from(
      editor.shadowRoot?.querySelectorAll("ha-entity-picker") ?? [],
    ).find(
      (picker) =>
        (picker as HTMLElement & { label?: string }).label === "Self-consumption energy entity",
    );
    selfConsumptionPicker?.dispatchEvent(
      new CustomEvent("value-changed", { detail: { value: "sensor.updated_self" } }),
    );

    expect(changes).toEqual([{ ...config, self_consumption_entity: "sensor.updated_self" }]);
  });

  it("removes an optional entity after the picker is cleared", async () => {
    const editor = await createEditor();
    const changes: Partial<PVPaybackCardConfig>[] = [];
    editor.addEventListener("config-changed", (event) => {
      changes.push((event as CustomEvent<{ config: Partial<PVPaybackCardConfig> }>).detail.config);
    });
    editor.setConfig({ ...config, production_energy_entity: "sensor.production" });
    await editor.updateComplete;

    const selfConsumptionPicker = Array.from(
      editor.shadowRoot?.querySelectorAll("ha-entity-picker") ?? [],
    ).find(
      (picker) =>
        (picker as HTMLElement & { label?: string }).label === "Self-consumption energy entity",
    );
    selfConsumptionPicker?.dispatchEvent(
      new CustomEvent("value-changed", { detail: { value: undefined } }),
    );

    const expected = { ...config, production_energy_entity: "sensor.production" };
    delete expected.self_consumption_entity;
    expect(changes).toEqual([expected]);
    expect("self_consumption_entity" in changes[0]).toBe(false);
  });

  it("removes an empty numeric value instead of converting it to zero", async () => {
    const editor = await createEditor();
    const changes: Partial<PVPaybackCardConfig>[] = [];
    editor.addEventListener("config-changed", (event) => {
      changes.push((event as CustomEvent<{ config: Partial<PVPaybackCardConfig> }>).detail.config);
    });
    editor.setConfig(config);
    await editor.updateComplete;

    const input = editor.shadowRoot?.querySelector('[name="investment_cost"]') as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("change"));

    expect("investment_cost" in changes[0]).toBe(false);
  });

  it("adds and removes individual PV consumers", async () => {
    const editor = await createEditor();
    const changes: Partial<PVPaybackCardConfig>[] = [];
    editor.addEventListener("config-changed", (event) => {
      changes.push((event as CustomEvent<{ config: Partial<PVPaybackCardConfig> }>).detail.config);
    });
    editor.setConfig(config);
    await editor.updateComplete;

    (editor.shadowRoot?.querySelector(".add-consumer") as HTMLButtonElement).click();
    await editor.updateComplete;

    expect(changes.at(-1)?.individual_consumers).toEqual([
      { name: "", entity: "", value_per_kwh: 0, baseline: 0 },
    ]);
    expect(editor.shadowRoot?.querySelector(".individual-consumers fieldset")).not.toBeNull();
    expect(editor.shadowRoot?.textContent).not.toContain("Icon (optional)");

    (editor.shadowRoot?.querySelector(".remove-consumer") as HTMLButtonElement).click();
    await editor.updateComplete;
    expect(changes.at(-1)?.individual_consumers).toBeUndefined();
  });
});
