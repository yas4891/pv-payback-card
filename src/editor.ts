import { LitElement, html, nothing, type TemplateResult } from "lit";
import type { HomeAssistant } from "./card";
import type { IndividualConsumerConfig, PVPaybackCardConfig } from "./calc";
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
      config.show_progress === false ||
      config.payback_date_format === "relative"
    ) {
      this._advancedOpen = true;
    }
  }

  private toggleAdvanced(): void {
    this._advancedOpen = !this._advancedOpen;
  }

  private emitConfig(config: Partial<PVPaybackCardConfig>): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
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
    this.emitConfig(config);
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
    this.emitConfig(config);
  }

  private addIndividualConsumer(): void {
    const consumers = [...(this._config.individual_consumers ?? [])];
    consumers.push({ name: "", entity: "", value_per_kwh: 0, baseline: 0 });
    this.emitConfig({ ...this._config, individual_consumers: consumers });
  }

  private removeIndividualConsumer(index: number): void {
    const consumers = [...(this._config.individual_consumers ?? [])];
    consumers.splice(index, 1);
    const config = { ...this._config };
    if (consumers.length > 0) config.individual_consumers = consumers;
    else delete config.individual_consumers;
    this.emitConfig(config);
  }

  private changeIndividualConsumer(
    index: number,
    key: keyof IndividualConsumerConfig,
    rawValue: unknown,
  ): void {
    const consumers = (this._config.individual_consumers ?? []).map((consumer) => ({
      ...consumer,
    }));
    const consumer = consumers[index];
    if (!consumer) return;
    if (key === "value_per_kwh" || key === "baseline") {
      const text = String(rawValue ?? "").trim();
      if (!text && key === "baseline") delete consumer.baseline;
      else {
        const value = Number(text);
        if (!Number.isFinite(value)) return;
        consumer[key] = value;
      }
    } else {
      const value = String(rawValue ?? "").trim();
      if (!value && key === "icon") delete consumer.icon;
      else consumer[key] = value;
    }
    this.emitConfig({ ...this._config, individual_consumers: consumers });
  }

  private individualConsumerEntityField(
    consumer: IndividualConsumerConfig,
    index: number,
    label: string,
  ): TemplateResult {
    const pickerAvailable = Boolean(this.hass && customElements.get("ha-entity-picker"));
    if (pickerAvailable) {
      return html`<ha-entity-picker
        .hass=${this.hass}
        .value=${consumer.entity}
        .label=${label}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${true}
        @value-changed=${(event: CustomEvent<{ value?: unknown }>) =>
          this.changeIndividualConsumer(index, "entity", event.detail?.value)}
      ></ha-entity-picker>`;
    }
    return html`<label
      >${label}<input
        type="text"
        .value=${consumer.entity}
        @change=${(event: Event) =>
          this.changeIndividualConsumer(index, "entity", (event.target as HTMLInputElement).value)}
    /></label>`;
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
      )}
      <section class="individual-consumers">
        <h3>${text.individual_consumers}</h3>
        <p>${text.individual_consumers_description}</p>
        ${(this._config.individual_consumers ?? []).map(
          (consumer, index) =>
            html`<fieldset>
              <legend>${consumer.name || `${text.individual_consumers} ${index + 1}`}</legend>
              <label
                >${text.individual_consumer_name}<input
                  type="text"
                  .value=${consumer.name}
                  @change=${(event: Event) =>
                    this.changeIndividualConsumer(
                      index,
                      "name",
                      (event.target as HTMLInputElement).value,
                    )}
              /></label>
              ${this.individualConsumerEntityField(
                consumer,
                index,
                text.individual_consumer_entity,
              )}
              <label
                >${text.individual_consumer_value}<input
                  type="number"
                  min="0"
                  step="any"
                  .value=${String(consumer.value_per_kwh)}
                  @change=${(event: Event) =>
                    this.changeIndividualConsumer(
                      index,
                      "value_per_kwh",
                      (event.target as HTMLInputElement).value,
                    )}
              /></label>
              <label
                >${text.individual_consumer_baseline}<input
                  type="number"
                  step="any"
                  .value=${String(consumer.baseline ?? "")}
                  @change=${(event: Event) =>
                    this.changeIndividualConsumer(
                      index,
                      "baseline",
                      (event.target as HTMLInputElement).value,
                    )}
              /></label>
              <label
                >${text.individual_consumer_icon}<input
                  type="text"
                  .value=${consumer.icon ?? ""}
                  @change=${(event: Event) =>
                    this.changeIndividualConsumer(
                      index,
                      "icon",
                      (event.target as HTMLInputElement).value,
                    )}
              /></label>
              <button
                type="button"
                class="remove-consumer"
                @click=${() => this.removeIndividualConsumer(index)}
              >
                ${text.individual_consumer_remove}
              </button>
            </fieldset>`,
        )}
        <button type="button" class="add-consumer" @click=${this.addIndividualConsumer}>
          ${text.individual_consumer_add}
        </button>
      </section>
      <label
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
              ${checkboxField("show_payback_date")}
              <label
                >${text.payback_date_format}<select
                  name="payback_date_format"
                  .value=${this._config.payback_date_format ?? "absolute"}
                  @change=${this.changed}
                >
                  <option value="absolute">${text.payback_date_format_absolute}</option>
                  <option value="relative">${text.payback_date_format_relative}</option>
                </select></label
              >
              ${
                this._config.payback_date_format === "relative"
                  ? html`<label
                      >${text.payback_date_relative_reference}<select
                        name="payback_date_relative_reference"
                        .value=${this._config.payback_date_relative_reference ?? "now"}
                        @change=${this.changed}
                      >
                        <option value="now">${text.payback_date_relative_reference_now}</option>
                        <option value="start_date">
                          ${text.payback_date_relative_reference_start_date}
                        </option>
                      </select></label
                    >`
                  : nothing
              }
              ${checkboxField("show_progress")} ${checkboxField("use_location_seasonality")}
              ${checkboxField("apply_annual_discount")}
            </section>`
          : nothing
      }`;
  }

  static styles = editorStyles;
}
customElements.define("pv-payback-card-editor", PVPaybackCardEditor);
