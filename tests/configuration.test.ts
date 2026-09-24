import { describe, expect, it } from "vitest";
import "../src/pv-payback-card";
import { validConfig, type PVPaybackCard, type PVPaybackCardConfig } from "../src/pv-payback-card";

const config: PVPaybackCardConfig = {
  type: "custom:pv-payback-card",
  start_date: "2026-01-01",
  investment_cost: 10_000,
  electricity_price: 0.3,
  feed_in_tariff: 0.08,
  self_consumption_entity: "sensor.own",
  export_energy_entity: "sensor.export",
};

describe("configuration validation", () => {
  it("rejects invalid payback date choices", () => {
    expect(validConfig({ ...config, payback_date_format: "unknown" as "relative" })).toBe(
      "payback_date_format",
    );
    expect(validConfig({ ...config, payback_date_relative_reference: "yesterday" as "now" })).toBe(
      "payback_date_relative_reference",
    );
  });
  it("throws for a missing energy-source structure", () => {
    const card = document.createElement("pv-payback-card") as PVPaybackCard;
    expect(() =>
      card.setConfig({
        ...config,
        self_consumption_entity: undefined,
        production_energy_entity: undefined,
      }),
    ).toThrow("self_consumption_entity or production_energy_entity is required");
  });

  it("validates individual consumer fields and duplicate entities", () => {
    expect(
      validConfig({
        ...config,
        individual_consumers: [
          { name: "Miner", entity: "sensor.consumer", value_per_kwh: 0.05 },
          { name: "Wallbox", entity: "sensor.consumer", value_per_kwh: 0.13 },
        ],
      }),
    ).toBe("individual_consumers.entity");
    expect(
      validConfig({
        ...config,
        individual_consumers: [{ name: "Miner", entity: "sensor.miner", value_per_kwh: -0.01 }],
      }),
    ).toBe("individual_consumers.value_per_kwh");
  });
});
