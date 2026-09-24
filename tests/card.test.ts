import { afterEach, describe, expect, it, vi } from "vitest";
import { PVPaybackCard, cacheKey, type PVPaybackCardConfig } from "../src/pv-payback-card";

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

describe("update filtering", () => {
  it("updates when an internal reactive property changes with hass", () => {
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.setConfig(config);
    card.hass = {
      states: {
        "sensor.own": { state: "1", attributes: { unit_of_measurement: "kWh" } },
        "sensor.export": { state: "1", attributes: { unit_of_measurement: "kWh" } },
      },
    };
    const changed = new Map<unknown, unknown>([
      ["hass", { states: { ...card.hass!.states } }],
      ["_scenarioDialogOpen", false],
    ]);
    const update = (
      card as unknown as { shouldUpdate: (values: typeof changed) => boolean }
    ).shouldUpdate(changed);

    expect(update).toBe(true);
  });
});

describe("sections grid sizing", () => {
  it("keeps the full layout wide and gives the compact layout half width", () => {
    const card = document.createElement("pv-payback-card") as PVPaybackCard;

    card.setConfig(config);
    expect(card.getGridOptions()).toMatchObject({ columns: 12, min_columns: 9 });

    card.setConfig({ ...config, display_style: "compact" });
    expect(card.getGridOptions()).toMatchObject({ columns: 6, min_columns: 6 });
  });
});

describe("persistent warning delay", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  async function createRegressedCard(): Promise<PVPaybackCard> {
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    localStorage.setItem(
      cacheKey(config, config.self_consumption_entity!),
      JSON.stringify({ value: 101, timestamp: "2026-01-10T12:00:00Z" }),
    );
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.hass = {
      states: {
        "sensor.own": { state: "100", attributes: { unit_of_measurement: "kWh" } },
        "sensor.export": { state: "50", attributes: { unit_of_measurement: "kWh" } },
      },
      locale: { language: "en" },
      config: { currency: "EUR" },
    };
    card.setConfig(config);
    document.body.append(card);
    await card.updateComplete;
    return card;
  }

  it("shows a persistent counter regression only after three minutes", async () => {
    vi.useFakeTimers();
    const card = await createRegressedCard();

    expect(card.shadowRoot?.querySelector(".warning-indicator")).toBeNull();
    await vi.advanceTimersByTimeAsync(179_999);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".warning-indicator")).toBeNull();

    await vi.advanceTimersByTimeAsync(1);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".warning-indicator")).not.toBeNull();
  });

  it("restarts the delay after the counter briefly recovers", async () => {
    vi.useFakeTimers();
    const card = await createRegressedCard();
    await vi.advanceTimersByTimeAsync(120_000);

    card.hass = {
      ...card.hass!,
      states: {
        ...card.hass!.states,
        "sensor.own": { state: "102", attributes: { unit_of_measurement: "kWh" } },
      },
    };
    await card.updateComplete;
    card.hass = {
      ...card.hass,
      states: {
        ...card.hass.states,
        "sensor.own": { state: "100", attributes: { unit_of_measurement: "kWh" } },
      },
    };
    await card.updateComplete;
    await vi.advanceTimersByTimeAsync(120_000);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".warning-indicator")).toBeNull();
  });

  it("shows unavailable details only through the warning indicator", async () => {
    vi.useFakeTimers();
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.hass = {
      states: {
        "sensor.own": { state: "unavailable", attributes: { unit_of_measurement: "kWh" } },
        "sensor.export": { state: "50", attributes: { unit_of_measurement: "kWh" } },
      },
      locale: { language: "en" },
      config: { currency: "EUR" },
    };
    card.setConfig(config);
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.textContent).not.toContain("No valid energy values");
    await vi.advanceTimersByTimeAsync(180_000);
    await card.updateComplete;
    const warning = card.shadowRoot?.querySelector(".warning-indicator") as HTMLButtonElement;
    expect(warning.title).toContain("sensor.own: unavailable");
    expect(card.shadowRoot?.textContent).not.toContain("sensor.own: unavailable");

    warning.click();
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector("ha-dialog")?.textContent).toContain(
      "sensor.own: unavailable",
    );
  });

  it("shows invalid configuration details only through the warning indicator", async () => {
    vi.useFakeTimers();
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.hass = { states: {}, locale: { language: "en" } };
    card.setConfig({ ...config, investment_cost: 0 });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.textContent).not.toContain("Invalid configuration");
    await vi.advanceTimersByTimeAsync(180_000);
    await card.updateComplete;
    const warning = card.shadowRoot?.querySelector(".warning-indicator") as HTMLButtonElement;
    expect(warning.title).toBe("Invalid configuration: investment_cost");

    warning.click();
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector("ha-dialog")?.textContent).toContain(
      "Invalid configuration: investment_cost",
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

    (card.shadowRoot?.querySelector(".benefit .scenario-trigger") as HTMLElement).click();
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
    expect(dialog.textContent).toContain("Estimated payback");
    expect(dialog.textContent).toContain("Remaining from today");
    expect(dialog.textContent).toContain("Duration from start date");
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

    (card.shadowRoot?.querySelector(".date .scenario-trigger") as HTMLElement).click();
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

    (card.shadowRoot?.querySelector(".benefit .scenario-trigger") as HTMLElement).click();
    await card.updateComplete;

    const text = card.shadowRoot?.querySelector("ha-dialog")?.textContent?.replace(/\s+/g, " ");
    expect(text).toContain("Discount rate: 3% (default)");
  });

  it("uses the compact layout with localized value tooltips", async () => {
    const card = await createCard();
    card.setConfig({ ...config, display_style: "compact" });
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".content")?.classList.contains("compact")).toBe(true);
    expect(card.shadowRoot?.querySelector(".benefit")?.getAttribute("title")).toBe(
      "Benefit to date",
    );
    expect(card.shadowRoot?.querySelector(".date")?.getAttribute("title")).toBe(
      "Estimated payback",
    );
    expect(card.shadowRoot?.querySelector(".breakdown .own")?.getAttribute("title")).toBe(
      "Self-consumption",
    );
    expect(card.shadowRoot?.querySelector(".breakdown .export")?.getAttribute("title")).toBe(
      "Export",
    );
  });

  it("shows localized contribution percentages and money in the progress tooltip", async () => {
    const card = await createCard();
    const trigger = card.shadowRoot?.querySelector(".progress-trigger") as HTMLButtonElement;
    const tooltip = card.shadowRoot?.querySelector(".progress-tooltip") as HTMLElement;

    expect(trigger.getAttribute("aria-describedby")).toBe("contribution-tooltip");
    expect(tooltip.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Self-consumption 88.24% · €3,000 Export 11.76% · €400",
    );

    trigger.click();
    await card.updateComplete;
    expect(trigger.classList.contains("tooltip-open")).toBe(true);
  });

  it("shows contribution percentages below their progress segments", async () => {
    const card = await createCard();
    card.setConfig({ ...config, show_contribution_segments: true });
    await card.updateComplete;

    const own = card.shadowRoot?.querySelector(".contribution-percentage-own") as HTMLElement;
    const exported = card.shadowRoot?.querySelector(
      ".contribution-percentage-export",
    ) as HTMLElement;
    expect(own.textContent).toBe("88.24%");
    expect(own.getAttribute("style")).toBe("width:30%");
    expect(exported.textContent).toBe("11.76%");
    expect(exported.getAttribute("style")).toBe("width:4%");
    expect(card.getGridOptions().rows).toBe(5);
  });
});

describe("relative payback date", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  function createCard(language: "de" | "en" = "en"): PVPaybackCard {
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.hass = {
      states: {
        "sensor.own": { state: "10000", attributes: { unit_of_measurement: "kWh" } },
        "sensor.export": { state: "5000", attributes: { unit_of_measurement: "kWh" } },
      },
      locale: { language },
      config: { currency: "EUR", latitude: 52.52, longitude: 13.405 },
    };
    return card;
  }

  it("keeps the calendar date by default and renders a relative duration when selected", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 22, 12));
    const card = createCard();
    card.setConfig(config);
    document.body.append(card);
    await card.updateComplete;
    expect(
      card.shadowRoot?.querySelector(".date .scenario-trigger")?.textContent?.trim(),
    ).not.toMatch(/^in /);

    card.setConfig({ ...config, payback_date_format: "relative" });
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".date .scenario-trigger")?.textContent?.trim()).toMatch(
      /^in \d+ (year|years|month|months|day|days)/,
    );

    (card.shadowRoot?.querySelector(".date .scenario-trigger") as HTMLButtonElement).click();
    await card.updateComplete;
    const dates = Array.from(
      card.shadowRoot?.querySelectorAll("ha-dialog .scenario-payback-date strong") ?? [],
    ).map((element) => element.textContent?.trim());
    const remaining = Array.from(
      card.shadowRoot?.querySelectorAll("ha-dialog .scenario-payback-remaining strong") ?? [],
    ).map((element) => element.textContent?.trim());
    const durations = Array.from(
      card.shadowRoot?.querySelectorAll("ha-dialog .scenario-payback-duration strong") ?? [],
    ).map((element) => element.textContent?.trim());
    expect(dates).toHaveLength(3);
    expect(dates.every((value) => value && !value.startsWith("in "))).toBe(true);
    expect(remaining).toHaveLength(3);
    expect(remaining.every((value) => value?.startsWith("in "))).toBe(true);
    expect(durations).toHaveLength(3);
    expect(durations.every((value) => value?.startsWith("after "))).toBe(true);
  });

  it("shows days, today, and overdue without rounding them to a month", () => {
    const card = createCard();
    card.setConfig({ ...config, payback_date_format: "relative" });
    const format = (
      card as unknown as { formatPaybackDate: (date: Date, now: Date) => string }
    ).formatPaybackDate.bind(card);
    const today = new Date(2026, 8, 22, 12);

    expect(format(new Date(2026, 8, 24), today)).toBe("in 2 days");
    expect(format(new Date(2026, 8, 22), today)).toBe("today");
    expect(format(new Date(2026, 8, 21), today)).toBe("overdue");
  });

  it("shows total time from the start date with German grammar", () => {
    const card = createCard("de");
    card.setConfig({
      ...config,
      start_date: "2025-02-10",
      payback_date_format: "relative",
      payback_date_relative_reference: "start_date",
    });
    const format = (
      card as unknown as { formatPaybackDate: (date: Date, now: Date) => string }
    ).formatPaybackDate.bind(card);

    expect(format(new Date(2027, 4, 31), new Date(2026, 8, 22))).toBe(
      "nach 2 Jahren, 3 Monaten, 21 Tagen",
    );
    expect(format(new Date(2025, 1, 10), new Date(2026, 8, 22))).toBe("am Startdatum");
  });
});
