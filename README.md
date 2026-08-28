# PV Payback Card

A Home Assistant Lovelace card that estimates a photovoltaic system's payback from cumulative self-consumption and export energy.

The card has no runtime dependency beyond Home Assistant. It accepts `Wh`, `kWh`, and `MWh` energy sensors.

## Installation

Add this repository as a custom repository in HACS, select **Dashboard**, and install it. Then add the generated resource to Lovelace if HACS does not add it automatically.

## Configuration

```yaml
type: custom:pv-payback-card
name: PV payback
start_date: "2024-12-01"
investment_cost: 17653.06
electricity_price: 0.20
feed_in_tariff: 0.075
self_consumption_entity: sensor.pv_self_consumption_total
export_energy_entity: sensor.pv_export_total
```

The energy entities must be cumulative energy values. Existing Home Assistant helpers work well. Build a helper if your inverter only provides different totals.

`show_breakdown`, `show_payback_date`, and `show_progress` default to `true`.

## Options

| Option                                                 | Required | Description                                                    |
| ------------------------------------------------------ | -------- | -------------------------------------------------------------- |
| `start_date`                                           | yes      | Installation or accounting start date, formatted `YYYY-MM-DD`. |
| `investment_cost`                                      | yes      | Net investment cost after grants.                              |
| `electricity_price`                                    | yes      | Value of one self-consumed kWh.                                |
| `feed_in_tariff`                                       | yes      | Feed-in remuneration per kWh.                                  |
| `self_consumption_entity`                              | yes      | Cumulative self-consumed energy entity.                        |
| `export_energy_entity`                                 | yes      | Cumulative exported energy entity.                             |
| `self_consumption_baseline`                            | no       | Entity reading at the start date, in kWh.                      |
| `export_energy_baseline`                               | no       | Entity reading at the start date, in kWh.                      |
| `name`, `icon`                                         | no       | Card heading and Material Design icon.                         |
| `currency`, `locale`                                   | no       | Overrides Home Assistant currency and language formatting.     |
| `show_breakdown`, `show_payback_date`, `show_progress` | no       | Visibility settings. Each defaults to `true`.                  |

## Data availability

During a temporary `unknown` or `unavailable` state, the card uses the latest valid value from browser storage. This avoids overnight resets. The card visibly marks cached data. It never treats a missing value as zero.

The card also keeps the higher cached value if a cumulative counter briefly reports a lower reading. It shows a localized warning in that case. The cache scope includes both selected entities, the start date, and both baselines. A changed accounting setup therefore starts with a separate cache.

The estimated date updates from the observed average financial benefit since `start_date`. It is available immediately after a positive benefit exists.

## Development

```sh
npm ci
npm run format:check
npm run lint
npm test
npm run build
```
