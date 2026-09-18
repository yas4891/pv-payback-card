import { describe, expect, it, vi } from "vitest";
import {
  PVPaybackCard,
  cacheKey,
  chooseEnergyValue,
  dailyEnergyFromStatistics,
  latestValidEnergyFromHistory,
  loadHistoricalStatistics,
  loadLastValidEnergyHistory,
  parseCachedEnergy,
  readCachedEnergy,
  statisticDailyDeltas,
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
  it("finds the newest numeric value in compressed Home Assistant history", () => {
    expect(
      latestValidEnergyFromHistory(
        [
          { s: "1200", lu: 1_767_873_600 },
          { s: "unavailable", lu: 1_767_877_200 },
          { s: "unknown", lu: 1_767_880_800 },
        ],
        "Wh",
      ),
    ).toEqual({ value: 1.2, timestamp: "2026-01-08T12:00:00.000Z" });
  });

  it("loads a small recorder window for missing energy entities", async () => {
    const requests: Record<string, unknown>[] = [];
    const result = await loadLastValidEnergyHistory(
      {
        callWS: async (request) => {
          requests.push(request);
          return {
            "sensor.history_own": [
              { s: "123.4", lu: 1_767_873_600 },
              { s: "unavailable", lu: 1_767_877_200 },
            ],
          };
        },
      },
      { "sensor.history_own": "kWh" },
      new Date("2026-01-10T12:00:00.000Z"),
    );

    expect(result).toEqual({
      "sensor.history_own": { value: 123.4, timestamp: "2026-01-08T12:00:00.000Z" },
    });
    expect(requests).toEqual([
      {
        type: "history/history_during_period",
        start_time: "2026-01-09T12:00:00.000Z",
        end_time: "2026-01-10T12:00:00.000Z",
        entity_ids: ["sensor.history_own"],
        include_start_time_state: true,
        significant_changes_only: true,
        minimal_response: true,
        no_attributes: true,
      },
    ]);
  });

  it("persists recorder history when an unavailable entity has no browser cache", async () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    const historyConfig = { ...config, self_consumption_entity: "sensor.history_recovery" };
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    card.hass = {
      states: {
        "sensor.history_recovery": {
          state: "unavailable",
          attributes: { unit_of_measurement: "kWh" },
        },
        "sensor.export": { state: "50", attributes: { unit_of_measurement: "kWh" } },
      },
      callWS: async () => ({
        "sensor.history_recovery": [{ s: "123.4", lu: 1_767_873_600 }],
      }),
      locale: { language: "en" },
      config: { currency: "EUR" },
    };
    card.setConfig(historyConfig);
    document.body.append(card);

    await vi.waitFor(() =>
      expect(
        readCachedEnergy(localStorage, cacheKey(historyConfig, "sensor.history_recovery")),
      ).toEqual({ value: 123.4, timestamp: "2026-01-08T12:00:00.000Z" }),
    );

    card.remove();
    vi.unstubAllGlobals();
  });

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
