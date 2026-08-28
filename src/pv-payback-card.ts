import { LitElement, css, html, nothing, type TemplateResult } from "lit";

type Unit = "Wh" | "kWh" | "MWh";
type EntityState = { state: string; attributes?: Record<string, unknown>; last_updated?: string };
type HomeAssistant = {
  states: Record<string, EntityState>;
  locale?: { language?: string };
  config?: { currency?: string };
};

export type PVPaybackCardConfig = {
  type: string;
  start_date: string;
  investment_cost: number;
  electricity_price: number;
  feed_in_tariff: number;
  self_consumption_entity: string;
  export_energy_entity: string;
  self_consumption_baseline?: number;
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
};

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
    self_consumption_baseline: "Ausgangswert Eigenverbrauch (kWh)",
    export_energy_baseline: "Ausgangswert Einspeisung (kWh)",
    show_breakdown: "Aufschlüsselung anzeigen",
    show_energy_values: "Energiewerte anzeigen",
    show_money_values: "Geldwerte anzeigen",
    show_payback_date: "Amortisationsdatum anzeigen",
    show_progress: "Fortschritt anzeigen",
  },
  en: {
    start_date: "Start date",
    investment_cost: "Investment cost",
    electricity_price: "Electricity price per kWh",
    feed_in_tariff: "Feed-in tariff per kWh",
    self_consumption_entity: "Self-consumption energy entity",
    export_energy_entity: "Export energy entity",
    self_consumption_baseline: "Self-consumption baseline (kWh)",
    export_energy_baseline: "Export baseline (kWh)",
    show_breakdown: "Show breakdown",
    show_energy_values: "Show energy values",
    show_money_values: "Show monetary values",
    show_payback_date: "Show payback date",
    show_progress: "Show progress",
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
  };
}

export function displayName(name: string | undefined, localizedTitle: string): string {
  return !name || name === "PV-Amortisation" ? localizedTitle : name;
}

export function calculatePayback(
  config: PVPaybackCardConfig,
  selfConsumption: number,
  exported: number,
  now = new Date(),
): Calculation {
  const own = Math.max(0, selfConsumption - (config.self_consumption_baseline ?? 0));
  const exportEnergy = Math.max(0, exported - (config.export_energy_baseline ?? 0));
  const ownValue = own * config.electricity_price;
  const exportValue = exportEnergy * config.feed_in_tariff;
  const benefit = ownValue + exportValue;
  const progress = Math.min(100, (benefit / config.investment_cost) * 100);
  const start = new Date(`${config.start_date}T00:00:00`);
  let paybackDate: Date | undefined;
  if (benefit > 0 && start <= now) {
    const elapsedDays = Math.max(1, (now.getTime() - start.getTime()) / 86_400_000);
    paybackDate = new Date(
      start.getTime() + (config.investment_cost / benefit) * elapsedDays * 86_400_000,
    );
  }
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

export function cacheKey(config: PVPaybackCardConfig, entity: string): string {
  const scope = JSON.stringify([
    config.self_consumption_entity,
    config.export_energy_entity,
    config.start_date,
    config.self_consumption_baseline ?? 0,
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
  if (!config.self_consumption_entity || !config.export_energy_entity) return "energy entity";
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
      "export_energy_baseline",
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
    name: "self_consumption_entity" | "export_energy_entity",
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
    name: "self_consumption_entity" | "export_energy_entity",
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
    const baselineFields: Array<[keyof PVPaybackCardConfig, string, string]> = [
      ["self_consumption_baseline", text.self_consumption_baseline, "number"],
      ["export_energy_baseline", text.export_energy_baseline, "number"],
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
    )}${this.entityField("self_consumption_entity", text.self_consumption_entity)}${this.entityField("export_energy_entity", text.export_energy_entity)}${baselineFields.map(
      textField,
    )}${(
      [
        "show_breakdown",
        "show_energy_values",
        "show_money_values",
        "show_payback_date",
        "show_progress",
      ] as const
    ).map(
      (name) =>
        html`<label
          ><input
            name=${name}
            type="checkbox"
            .checked=${this._config[name] !== false}
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
  static properties = { hass: { attribute: false }, _config: { state: true } };
  declare hass?: HomeAssistant;
  declare _config?: PVPaybackCardConfig;

  static getStubConfig(): Partial<PVPaybackCardConfig> {
    return {
      type: "custom:pv-payback-card",
      show_breakdown: true,
      show_energy_values: true,
      show_money_values: true,
      show_payback_date: true,
      show_progress: true,
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("pv-payback-card-editor");
  }

  setConfig(config: PVPaybackCardConfig): void {
    this._config = withDisplayDefaults(config);
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

  render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;
    const t = this.text();
    const configError = validConfig(config);
    if (configError)
      return html`<ha-card
        ><div class="content error" role="alert">${t.invalid}: ${configError}</div></ha-card
      >`;
    const self = this.readEnergy(config, config.self_consumption_entity, t);
    const exported = this.readEnergy(config, config.export_energy_entity, t);
    if (self.value === undefined || exported.value === undefined)
      return html`<ha-card
        ><div class="content error" role="alert">
          ${t.unavailable}${self.warning ? html`<br />${self.warning}` : nothing}${
            exported.warning ? html`<br />${exported.warning}` : nothing
          }
        </div></ha-card
      >`;
    const calc = calculatePayback(config, self.value, exported.value);
    const cached = self.cached || exported.cached;
    const cacheTime = [self.timestamp, exported.timestamp].filter(Boolean).sort().at(0);
    return html`<ha-card>
      <div class="content">
        <div class="header">
          <ha-icon .icon=${config.icon ?? "mdi:solar-power-variant"}></ha-icon
          ><span>${displayName(config.name, t.title)}</span>
        </div>
        <div class="benefit">
          <span>${t.benefit}</span><strong>${this.formatMoney(calc.benefit)}</strong>
        </div>
        ${
          config.show_progress
            ? html`<div class="progress-label">
                  <span>${t.progress}</span><span>${calc.progress.toFixed(1)}%</span>
                </div>
                <div
                  class="bar"
                  role="progressbar"
                  aria-label=${t.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow=${calc.progress}
                >
                  <div style=${`width:${calc.progress}%`}></div>
                </div>`
            : nothing
        }
        ${
          config.show_breakdown && (config.show_energy_values || config.show_money_values)
            ? html`<div class="breakdown">
                <div>
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
                <div>
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
        ${config.show_payback_date ? html`<div class="date"><span>${t.expected}</span><b>${calc.paybackDate ? new Intl.DateTimeFormat(config.locale ?? this.hass?.locale?.language, { dateStyle: "medium" }).format(calc.paybackDate) : t.noProjection}</b></div>` : nothing}
        ${cached ? html`<div class="notice" role="status" aria-live="polite">${t.cached}${cacheTime ? `: ${new Intl.DateTimeFormat(config.locale ?? this.hass?.locale?.language, { dateStyle: "short", timeStyle: "short" }).format(new Date(cacheTime))}` : ""}${self.warning ? html`<br />${self.warning}` : nothing}${exported.warning ? html`<br />${exported.warning}` : nothing}</div>` : nothing}
      </div>
    </ha-card>`;
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
      gap: 10px;
      font-size: 1.1em;
      font-weight: 600;
    }
    ha-icon {
      color: var(--primary-color);
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
    .progress-label,
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
    .progress-label span:first-child,
    .benefit span {
      color: var(--secondary-text-color);
    }
    .breakdown b {
      font-size: 0.92em;
    }
    .date {
      align-items: start;
      margin-top: 18px;
    }
    .date b {
      text-align: end;
    }
    .notice,
    .error {
      margin-top: 16px;
      color: var(--warning-color);
      font-size: 0.88em;
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
