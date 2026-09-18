import { LitElement, html, nothing, type TemplateResult } from "lit";
import type { HomeAssistant } from "./card";
import type { PVPaybackCardConfig } from "./calc";
import { editorTranslations } from "./i18n";
import { editorStyles } from "./styles";

export class PVPaybackCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _advancedOpen: { state: true },
  };
  declare hass?: HomeAssistant;
  declare _config: Partial<PVPaybackCardConfig>;
  declare _advancedOpen: boolean;

  constructor() {
    super();
    this._config = {};
    this._advancedOpen = false;
  }

  setConfig(config: PVPaybackCardConfig): void {
    this._config = { ...config };
    if (
      config.self_consumption_entity ||
      config.self_consumption_baseline !== undefined ||
      config.use_location_seasonality === true ||
      config.apply_annual_discount === true ||
      config.use_historical_statistics === true ||
      (config.annual_discount_rate ?? 0) !== 0 ||
      config.show_breakdown === false ||
      config.show_energy_values === false ||
      config.show_money_values === false ||
      config.show_payback_date === false ||
      config.show_progress === false
    ) {
      this._advancedOpen = true;
    }
  }

  private toggleAdvanced(): void {
    this._advancedOpen = !this._advancedOpen;
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
    const config = { ...this._config };
    if (target.type === "checkbox") {
      config[target.name as keyof PVPaybackCardConfig] = target.checked as never;
    } else if (numeric) {
      const rawValue = target.value.trim();
      if (!rawValue) {
        delete config[target.name as keyof PVPaybackCardConfig];
      } else {
        const value = Number(rawValue);
        if (!Number.isFinite(value)) return;
        config[target.name as keyof PVPaybackCardConfig] = value as never;
      }
    } else {
      config[target.name as keyof PVPaybackCardConfig] = target.value as never;
    }
    this._config = config;
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
    const rawValue = (event as CustomEvent<{ value?: unknown }>).detail?.value;
    const value = typeof rawValue === "string" ? rawValue.trim() : "";
    const config = { ...this._config };
    if (value) config[name] = value;
    else delete config[name];
    this._config = config;
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
    const standardBaselineFields: Array<[keyof PVPaybackCardConfig, string, string]> = [
      ["production_energy_baseline", text.production_energy_baseline, "number"],
      ["export_energy_baseline", text.export_energy_baseline, "number"],
    ];
    const advancedFields: Array<[keyof PVPaybackCardConfig, string, string]> = [
      ["self_consumption_baseline", text.self_consumption_baseline, "number"],
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
    const checkboxField = (
      name:
        | "show_breakdown"
        | "show_energy_values"
        | "show_money_values"
        | "show_payback_date"
        | "show_progress"
        | "show_contribution_segments"
        | "use_location_seasonality"
        | "apply_annual_discount",
    ) =>
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
      >`;
    return html`${requiredFields.map(
        textField,
      )}${this.entityField("production_energy_entity", text.production_energy_entity)}${this.entityField("export_energy_entity", text.export_energy_entity)}${standardBaselineFields.map(
        textField,
      )}<label
        >${text.display_style}<select
          name="display_style"
          .value=${this._config.display_style ?? "full"}
          @change=${this.changed}
        >
          <option value="full">${text.display_style_full}</option>
          <option value="compact">${text.display_style_compact}</option>
        </select></label
      >${checkboxField("show_contribution_segments")}
      <button
        class="advanced-toggle"
        type="button"
        aria-expanded=${this._advancedOpen ? "true" : "false"}
        @click=${this.toggleAdvanced}
      >
        <span>${text.advanced_settings}</span>
        <ha-icon icon=${this._advancedOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
      ${
        this._advancedOpen
          ? html`<section class="advanced-settings">
              <p>${text.advanced_settings_description}</p>
              ${this.entityField("self_consumption_entity", text.self_consumption_entity)}
              ${advancedFields.map(textField)} ${checkboxField("show_breakdown")}
              ${checkboxField("show_energy_values")} ${checkboxField("show_money_values")}
              ${checkboxField("show_payback_date")} ${checkboxField("show_progress")}
              ${checkboxField("use_location_seasonality")} ${checkboxField("apply_annual_discount")}
            </section>`
          : nothing
      }`;
  }

  static styles = editorStyles;
}
customElements.define("pv-payback-card-editor", PVPaybackCardEditor);
