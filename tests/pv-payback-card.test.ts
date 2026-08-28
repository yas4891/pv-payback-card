import { describe, expect, it } from "vitest";
import {
  cacheKey,
  calculatePayback,
  chooseEnergyValue,
  energyToKwh,
  parseCachedEnergy,
  readCachedEnergy,
  type PVPaybackCardConfig,
} from "../src/pv-payback-card";

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
    expect(cacheKey(config, config.self_consumption_entity)).not.toBe(
      cacheKey(changed, changed.self_consumption_entity),
    );
  });
});
