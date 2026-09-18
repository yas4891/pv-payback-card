import { describe, expect, it } from "vitest";
import "../src/pv-payback-card";
import type { PVPaybackCard, PVPaybackCardConfig } from "../src/pv-payback-card";

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
});
