import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import {
  appliesAnnualDiscount,
  assertConfigStructure,
  cacheKey,
  calendarDay,
  calculatePayback,
  calculateScenarioComparisons,
  chooseEnergyValue,
  dailyEnergyFromStatistics,
  dateKey,
  displayName,
  energyToKwh,
  historicalStatisticsCacheKey,
  isUnit,
  loadHistoricalStatistics,
  loadLastValidEnergyHistory,
  readCachedEnergy,
  validConfig,
  validLocation,
  withDisplayDefaults,
  type CachedEnergy,
  type Calculation,
  type EnergyRead,
  type HistoricalStatistics,
  type PVPaybackCardConfig,
  type ScenarioCalculations,
  type Unit,
} from "./calc";
import { PVPaybackCardEditor } from "./editor";
import { translations } from "./i18n";
import { cardStyles } from "./styles";

export type EntityState = {
  state: string;
  attributes?: Record<string, unknown>;
  last_updated?: string;
};
export type HomeAssistant = {
  states: Record<string, EntityState>;
  locale?: { language?: string };
  config?: { currency?: string; latitude?: number; longitude?: number };
  callWS?: (message: Record<string, unknown>) => Promise<unknown>;
};

const WARNING_DELAY_MS = 3 * 60 * 1000;

export class PVPaybackCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _scenarioDialogOpen: { state: true },
    _contributionTooltipOpen: { state: true },
    _warningDialogMessage: { state: true },
  };
  declare hass?: HomeAssistant;
  declare _config?: PVPaybackCardConfig;
  declare _scenarioDialogOpen: boolean;
  declare _contributionTooltipOpen: boolean;
  declare _warningDialogMessage?: string;

  constructor() {
    super();
    this._scenarioDialogOpen = false;
    this._contributionTooltipOpen = false;
  }

  static getStubConfig(): Partial<PVPaybackCardConfig> {
    return {
      type: "custom:pv-payback-card",
      display_style: "full",
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
    assertConfigStructure(config);
    this._comparisonDiscountRate = config.annual_discount_rate ?? 3;
    this._comparisonUsesDefaultRate = config.annual_discount_rate === undefined;
    this._config = withDisplayDefaults(config);
    this._contributionTooltipOpen = false;
    this._historicalStatistics = undefined;
    this._historicalStatisticsKey = undefined;
    this._historyRecoveryKey = undefined;
    this._calculationCache = undefined;
    this._scenarioCalculationCache = undefined;
    this.resetWarningDelay();
  }

  private _historicalStatistics?: HistoricalStatistics;
  private _historicalStatisticsKey?: string;
  private _historyRecoveryKey?: string;
  private _calculationCache?: { key: string; calculation: Calculation };
  private _scenarioCalculationCache?: { key: string; scenarios: ScenarioCalculations };
  private _comparisonDiscountRate = 3;
  private _comparisonUsesDefaultRate = true;
  private _warningStartedAt = new Map<string, number>();
  private _warningTimer?: ReturnType<typeof setTimeout>;
  private _pendingEnergyCacheWrites = new Map<string, CachedEnergy>();

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resetWarningDelay();
  }

  protected shouldUpdate(changedProperties: PropertyValues<this>): boolean {
    if ([...changedProperties.keys()].some((property) => property !== "hass")) return true;
    if (!changedProperties.has("hass")) return true;
    const previousHass = changedProperties.get("hass") as HomeAssistant | undefined;
    const currentHass = this.hass;
    const config = this._config;
    if (!config || !previousHass || !currentHass) return true;

    if (
      previousHass.locale?.language !== currentHass.locale?.language ||
      previousHass.config?.currency !== currentHass.config?.currency ||
      previousHass.config?.latitude !== currentHass.config?.latitude ||
      previousHass.config?.longitude !== currentHass.config?.longitude
    ) {
      return true;
    }

    const entities = [
      config.self_consumption_entity ?? config.production_energy_entity,
      config.export_energy_entity,
    ].filter((entityId): entityId is string => Boolean(entityId));
    return entities.some((entityId) => {
      const before = previousHass.states[entityId];
      const after = currentHass.states[entityId];
      return (
        before?.state !== after?.state ||
        before?.last_updated !== after?.last_updated ||
        before?.attributes?.unit_of_measurement !== after?.attributes?.unit_of_measurement
      );
    });
  }

  private resetWarningDelay(): void {
    this._warningStartedAt.clear();
    if (this._warningTimer !== undefined) clearTimeout(this._warningTimer);
    this._warningTimer = undefined;
  }

  private persistentWarningReadings(readings: EnergyRead[]): EnergyRead[] {
    const now = Date.now();
    const active = readings.filter(
      (reading): reading is EnergyRead & { issueKey: string } => reading.issueKey !== undefined,
    );
    const activeKeys = new Set(active.map((reading) => reading.issueKey));
    for (const key of this._warningStartedAt.keys()) {
      if (!activeKeys.has(key)) this._warningStartedAt.delete(key);
    }
    for (const reading of active) {
      if (!this._warningStartedAt.has(reading.issueKey)) {
        this._warningStartedAt.set(reading.issueKey, now);
      }
    }

    const visible = active.filter(
      (reading) => now - this._warningStartedAt.get(reading.issueKey)! >= WARNING_DELAY_MS,
    );
    const remaining = active
      .map((reading) => WARNING_DELAY_MS - (now - this._warningStartedAt.get(reading.issueKey)!))
      .filter((delay) => delay > 0);
    if (this._warningTimer !== undefined) clearTimeout(this._warningTimer);
    this._warningTimer = undefined;
    if (remaining.length > 0) {
      this._warningTimer = setTimeout(
        () => {
          this._warningTimer = undefined;
          this.requestUpdate();
        },
        Math.min(...remaining),
      );
    }
    return visible;
  }

  protected updated(): void {
    this.flushPendingEnergyCacheWrites();
    const config = this._config;
    if (!config || !this.hass?.callWS) return;
    if (appliesAnnualDiscount(config) && (config.annual_discount_rate ?? 0) > 0) {
      const completedEnd = calendarDay(new Date());
      completedEnd.setDate(completedEnd.getDate() - 1);
      const key = historicalStatisticsCacheKey(config, dateKey(completedEnd));
      if (this._historicalStatisticsKey !== key) {
        this._historicalStatisticsKey = key;
        loadHistoricalStatistics(this.hass, config)?.then((statistics) => {
          if (statistics && this._historicalStatisticsKey === key) {
            this._historicalStatistics = statistics;
            this.requestUpdate();
          }
        });
      }
    }
    this.recoverMissingEnergyFromHistory(config);
  }

  private flushPendingEnergyCacheWrites(): void {
    for (const [key, value] of this._pendingEnergyCacheWrites) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage can be blocked in privacy-restricted browser contexts.
      }
    }
    this._pendingEnergyCacheWrites.clear();
  }

  private recoverMissingEnergyFromHistory(config: PVPaybackCardConfig): void {
    if (!this.hass?.callWS) return;
    const entityIds = config.self_consumption_entity
      ? [config.self_consumption_entity, config.export_energy_entity]
      : [config.production_energy_entity, config.export_energy_entity].filter(
          (entityId): entityId is string => Boolean(entityId),
        );
    const missing: Record<string, Unit> = {};
    for (const entityId of entityIds) {
      const state = this.hass.states[entityId];
      const unit = state?.attributes?.unit_of_measurement;
      if (!isUnit(unit)) continue;
      const numeric = Number(state.state);
      const current = energyToKwh(numeric, unit);
      const cached = readCachedEnergy(localStorage, cacheKey(config, entityId));
      if (current === undefined && cached === undefined) missing[entityId] = unit;
    }
    const recoveryKey = JSON.stringify(
      Object.keys(missing)
        .sort()
        .map((entityId) => cacheKey(config, entityId)),
    );
    if (Object.keys(missing).length === 0 || this._historyRecoveryKey === recoveryKey) return;
    this._historyRecoveryKey = recoveryKey;
    loadLastValidEnergyHistory(this.hass, missing)?.then((values) => {
      if (this._historyRecoveryKey !== recoveryKey) return;
      for (const [entityId, value] of Object.entries(values)) {
        try {
          localStorage.setItem(cacheKey(config, entityId), JSON.stringify(value));
        } catch {
          // Storage can be blocked in privacy-restricted browser contexts.
        }
      }
      if (Object.keys(values).length > 0) this.requestUpdate();
    });
  }

  getCardSize(): number {
    const config = this._config;
    if (!config) return 1;
    const visibleBlocks =
      Number(config.show_progress) +
      Number(config.show_breakdown && (config.show_energy_values || config.show_money_values)) +
      Number(config.show_payback_date);
    if (config.display_style === "compact") return visibleBlocks > 1 ? 2 : 1;
    return Math.max(1, 1 + visibleBlocks);
  }

  getGridOptions(): { columns: number; rows: number; min_columns: number; min_rows: number } {
    const compact = this._config?.display_style === "compact";
    return {
      columns: compact ? 3 : 4,
      rows: this.getCardSize(),
      min_columns: compact ? 2 : 3,
      min_rows: 1,
    };
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
    const unit = state?.attributes?.unit_of_measurement;
    const unavailableWarning =
      state && !isUnit(unit) ? messages.unsupportedUnit : messages.entityUnavailable;
    if (selected.value !== undefined) {
      if (!selected.cached) {
        const value = {
          value: selected.value,
          timestamp: state?.last_updated ?? new Date().toISOString(),
        };
        if (cached?.value !== value.value || cached.timestamp !== value.timestamp) {
          this._pendingEnergyCacheWrites.set(cacheKey(config, entityId), value);
        }
      }
      return {
        value: selected.value,
        cached: selected.cached,
        timestamp: selected.cached ? cached?.timestamp : state?.last_updated,
        warning: selected.regression
          ? `${entityId}: ${messages.counterRegression}`
          : selected.cached
            ? `${entityId}: ${unavailableWarning}`
            : undefined,
        issueKey: selected.cached
          ? `${entityId}:${selected.regression ? "regression" : "unavailable"}`
          : undefined,
      };
    }
    return {
      cached: false,
      issueKey: `${entityId}:${state && !isUnit(unit) ? "unsupported-unit" : "unavailable"}`,
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
  private formatMoney(value: number, maximumFractionDigits = 0): string {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      style: "currency",
      currency: this._config?.currency ?? this.hass?.config?.currency ?? "EUR",
      maximumFractionDigits,
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
      : "—";
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

  private toggleContributionTooltip(): void {
    this._contributionTooltipOpen = !this._contributionTooltipOpen;
  }

  private closeContributionTooltip(): void {
    this._contributionTooltipOpen = false;
  }

  private handleContributionTooltipKeydown(event: KeyboardEvent): void {
    if (event.key !== "Escape") return;
    this.closeContributionTooltip();
    (event.currentTarget as HTMLElement).blur();
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
    const scenarioWarnings = [
      !locationValid ? t.locationFallback : undefined,
      rows.some(({ scenario }) => !scenario.paybackDate) ? t.noProjection : undefined,
    ].filter((message) => message !== undefined);
    return html`<ha-dialog
      .open=${this._scenarioDialogOpen}
      .heading=${t.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${
          scenarioWarnings.length > 0
            ? html`<div class="scenario-warning">
                ${this.renderWarningIndicator(scenarioWarnings.join("\n"))}
              </div>`
            : nothing
        }
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
                  <span>${t.benefit}</span><strong>${this.formatMoney(scenario.benefit, 2)}</strong>
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

  private renderWarningIndicator(message: string): TemplateResult {
    return html`<button
      class="warning-indicator"
      type="button"
      aria-label=${message}
      title=${message}
      @click=${() => {
        this._warningDialogMessage = message;
      }}
    >
      <ha-icon icon="mdi:alert"></ha-icon>
    </button>`;
  }

  private closeWarningDialog(): void {
    this._warningDialogMessage = undefined;
  }

  private renderWarningDialog(): TemplateResult | typeof nothing {
    if (!this._warningDialogMessage) return nothing;
    const t = this.text();
    return html`<ha-dialog
      .open=${true}
      .heading=${t.warningTitle}
      @closed=${this.closeWarningDialog}
    >
      <div class="warning-dialog-message">${this._warningDialogMessage}</div>
      <ha-button slot="primaryAction" @click=${this.closeWarningDialog}>${t.close}</ha-button>
    </ha-dialog>`;
  }

  private renderStatusCard(message?: string): TemplateResult {
    const config = this._config!;
    const t = this.text();
    return html`<ha-card>
        <div class="content status-only">
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${config.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${displayName(config.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${message ? this.renderWarningIndicator(message) : nothing}
            </div>
          </div>
        </div>
      </ha-card>
      ${this.renderWarningDialog()}`;
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

  render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;
    const t = this.text();
    const configError = validConfig(config);
    if (configError) {
      const warnings = this.persistentWarningReadings([
        {
          cached: false,
          issueKey: `configuration:${configError}`,
          warning: `${t.invalid}: ${configError}`,
        },
      ]);
      return this.renderStatusCard(warnings[0]?.warning);
    }
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
    let warningReadings = this.persistentWarningReadings(sourceReadings);
    const selfValue = self?.value;
    const productionValue = production?.value;
    const exportedValue = exported.value;
    if (
      exportedValue === undefined ||
      (self !== undefined && selfValue === undefined) ||
      (production !== undefined && productionValue === undefined)
    ) {
      const warning =
        warningReadings.length > 0
          ? `${t.unavailable}${warningReadings
              .filter((reading) => reading.warning)
              .map((reading) => ` ${reading.warning}`)
              .join("")}`
          : undefined;
      return this.renderStatusCard(warning);
    }
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
    const projectionIssue: EnergyRead | undefined =
      config.show_payback_date && !calc.paybackDate
        ? {
            cached: false,
            issueKey: "projection:no-positive-benefit",
            warning: t.noProjection,
          }
        : undefined;
    warningReadings = this.persistentWarningReadings([
      ...sourceReadings,
      ...(projectionIssue ? [projectionIssue] : []),
    ]);
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
    const dataWarningReadings = warningReadings.filter(
      (reading) => reading.issueKey !== "projection:no-positive-benefit",
    );
    const cacheTime = dataWarningReadings
      .map((reading) => reading.timestamp)
      .filter(Boolean)
      .sort()
      .at(0);
    const cacheWarning =
      dataWarningReadings.length > 0
        ? `${t.cached}${
            cacheTime
              ? `: ${new Intl.DateTimeFormat(config.locale ?? this.hass?.locale?.language, {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(cacheTime))}`
              : ""
          }${dataWarningReadings
            .filter((reading) => reading.warning)
            .map((reading) => ` ${reading.warning}`)
            .join("")}`
        : undefined;
    const projectionWarning = warningReadings.some(
      (reading) => reading.issueKey === "projection:no-positive-benefit",
    )
      ? t.noProjection
      : undefined;
    const cardWarning = [cacheWarning, projectionWarning]
      .filter((message): message is string => Boolean(message))
      .join("\n");
    const ownContribution = Math.min(
      100,
      Math.max(0, (calc.ownValue / config.investment_cost) * 100),
    );
    const exportContribution = Math.min(
      Math.max(0, 100 - ownContribution),
      Math.max(0, (calc.exportValue / config.investment_cost) * 100),
    );
    const ownShare = calc.benefit > 0 ? (calc.ownValue / calc.benefit) * 100 : 0;
    const exportShare = calc.benefit > 0 ? (calc.exportValue / calc.benefit) * 100 : 0;
    const compact = config.display_style === "compact";
    return html`<ha-card>
        <div class=${`content ${compact ? "compact" : "full"}`}>
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${config.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${displayName(config.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${cardWarning ? this.renderWarningIndicator(cardWarning) : nothing}
              ${
                config.show_progress
                  ? html`<span class="header-progress">${calc.progress.toFixed(1)}%</span>`
                  : nothing
              }
            </div>
          </div>
          <div class="benefit" title=${compact ? t.benefit : nothing}>
            <span>${t.benefit}</span
            ><button
              type="button"
              class="scenario-trigger"
              aria-label=${`${t.scenariosOpen}: ${t.benefit}`}
              @click=${this.openScenarioDialog}
            >
              ${this.formatMoney(calc.benefit)}
            </button>
          </div>
          ${
            config.show_progress
              ? html`<button
                  class=${`progress-trigger ${this._contributionTooltipOpen ? "tooltip-open" : ""}`}
                  type="button"
                  aria-label=${`${t.progress}: ${this.formatPercentage(calc.progress)}`}
                  aria-describedby="contribution-tooltip"
                  @click=${this.toggleContributionTooltip}
                  @blur=${this.closeContributionTooltip}
                  @keydown=${this.handleContributionTooltipKeydown}
                >
                  <span
                    class="bar ${config.show_contribution_segments ? "contribution-segments" : ""}"
                    role="progressbar"
                    aria-label=${t.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow=${calc.progress}
                  >
                    ${
                      config.show_contribution_segments
                        ? html`<span
                              class="contribution-own"
                              style=${`width:${ownContribution}%`}
                            ></span>
                            <span
                              class="contribution-export"
                              style=${`width:${exportContribution}%`}
                            ></span>`
                        : html`<span style=${`width:${calc.progress}%`}></span>`
                    }
                  </span>
                  <span id="contribution-tooltip" class="progress-tooltip" role="tooltip">
                    <span class="tooltip-row tooltip-own">
                      <span>${t.own}</span>
                      <strong
                        >${this.formatPercentage(ownShare)} ·
                        ${this.formatMoney(calc.ownValue)}</strong
                      >
                    </span>
                    <span class="tooltip-row tooltip-export">
                      <span>${t.export}</span>
                      <strong
                        >${this.formatPercentage(exportShare)} ·
                        ${this.formatMoney(calc.exportValue)}</strong
                      >
                    </span>
                  </span>
                </button>`
              : nothing
          }
          ${
            config.show_breakdown && (config.show_energy_values || config.show_money_values)
              ? html`<div
                  class="breakdown ${config.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <button
                    class="own breakdown-action"
                    type="button"
                    ?disabled=${!config.self_consumption_entity}
                    aria-label=${t.own}
                    title=${compact ? t.own : nothing}
                    @click=${() =>
                      config.self_consumption_entity &&
                      this.openMoreInfo(config.self_consumption_entity)}
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
                  </button>
                  <button
                    class="export breakdown-action"
                    type="button"
                    aria-label=${t.export}
                    title=${compact ? t.export : nothing}
                    @click=${() => this.openMoreInfo(config.export_energy_entity)}
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
                  </button>
                </div>`
              : nothing
          }
          ${
            config.show_payback_date
              ? html`<div class="date" title=${compact ? t.expected : nothing}>
                  <span>${t.expected}</span
                  ><button
                    type="button"
                    class="scenario-trigger"
                    aria-label=${`${t.scenariosOpen}: ${t.expected}`}
                    @click=${this.openScenarioDialog}
                  >
                    ${this.formatDate(calc.paybackDate)}
                  </button>
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
      }
      ${this.renderWarningDialog()}`;
  }

  static styles = cardStyles;
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
  name: "Solar Payback Card",
  description: "Displays solar financial payback from cumulative energy sensors.",
});
