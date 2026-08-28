# PV Payback Card

[![HACS custom repository](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)](https://hacs.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Validate](https://github.com/yas4891/pv-payback-card/actions/workflows/validate.yml/badge.svg)](https://github.com/yas4891/pv-payback-card/actions/workflows/validate.yml)

PV Payback Card is a custom Lovelace card for [Home Assistant](https://www.home-assistant.io/). It estimates when a photovoltaic installation reaches payback from cumulative self-consumption and grid-export energy.

The card calculates the financial benefit directly in the browser. It needs no companion integration and no vendor-specific inverter integration. Configure the two cumulative energy entities that fit your setup, including template helpers when your installation combines several meters.

The card accepts `Wh`, `kWh`, and `MWh` sensors. It also preserves the latest valid reading during a temporary overnight `unknown` or `unavailable` state.

## Features

- Configurable start date, investment cost, electricity price, and feed-in tariff.
- Cumulative self-consumption and export-energy entities chosen in the visual editor.
- Payback forecast from the observed average financial benefit since the start date.
- Optional baseline values for counters that started before the accounting period.
- Cached last valid readings and visible warnings for unavailable or decreasing counters.
- Localized German and English output.
- Responsive layout for desktop and mobile dashboards.

## Installation

### Via HACS

This repository is currently installed as a HACS custom repository.

[![Open this repository in your Home Assistant instance](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=yas4891&repository=pv-payback-card&category=plugin)

1. Select the button above from a device that can open your Home Assistant instance.
2. Confirm the custom repository as type **Dashboard**.
3. Open HACS, select **PV Payback Card**, and choose **Download**.
4. Reload the browser when HACS finishes.
5. Add the card through the dashboard editor and configure its entities.

HACS usually registers the dashboard resource automatically. Add the following resource manually only when Home Assistant does not load the card:

```yaml
url: /hacsfiles/pv-payback-card/pv-payback-card.js
type: module
```

### Manual installation

1. Download `dist/pv-payback-card.js` from this repository.
2. Copy it to `config/www/pv-payback-card/pv-payback-card.js`.
3. Register the following Home Assistant dashboard resource.

```yaml
url: /local/pv-payback-card/pv-payback-card.js
type: module
```

4. Reload the browser and add `custom:pv-payback-card` in the dashboard editor.

## Quick configuration

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

The card uses cumulative energy values, not current power values. Use a Home Assistant helper when the inverter exposes only separate or vendor-specific totals.

## Configuration options

| Option                      | Required | Default                 | Description and example                                                                                                                                                                                                                       |
| --------------------------- | -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `start_date`                | Yes      | —                       | Installation or accounting start date in `YYYY-MM-DD` format. Example: `"2024-12-01"`. The forecast uses the average benefit since this date.                                                                                                 |
| `investment_cost`           | Yes      | —                       | Net investment cost after grants, entered as a number without a currency symbol or thousands separator. Example: `17653.06`.                                                                                                                  |
| `electricity_price`         | Yes      | —                       | Value of one self-consumed `kWh`, in the selected currency. Use a decimal point, never a comma. Example: `0.2` means EUR/USD 0.20 per `kWh`; `0,2` is not valid. This fixed value applies to the complete selected accounting period.         |
| `feed_in_tariff`            | Yes      | —                       | Remuneration for one exported `kWh`, in the selected currency. Use a decimal point, never a comma. Example: `0.075` means EUR/USD 0.075 per `kWh`; `0,075` is not valid. This fixed value applies to the complete selected accounting period. |
| `self_consumption_entity`   | Yes      | —                       | Entity with total self-consumed PV energy. The entity must expose a cumulative numeric value in `Wh`, `kWh`, or `MWh`. Example: `sensor.pv_self_consumption_total`.                                                                           |
| `export_energy_entity`      | Yes      | —                       | Entity with total energy exported to the grid. The entity must expose a cumulative numeric value in `Wh`, `kWh`, or `MWh`. Example: `sensor.pv_export_total`.                                                                                 |
| `self_consumption_baseline` | No       | `0`                     | Self-consumption counter reading at `start_date`, in `kWh`. Use it when the selected counter began before the accounting period. Example: `1250.4`.                                                                                           |
| `export_energy_baseline`    | No       | `0`                     | Export counter reading at `start_date`, in `kWh`. Use it when the selected counter began before the accounting period. Example: `830.7`.                                                                                                      |
| `name`                      | No       | Localized title         | Card heading. Example: `"PV payback"`.                                                                                                                                                                                                        |
| `icon`                      | No       | `mdi:solar-power`       | Material Design icon in the card heading. Example: `mdi:solar-power-variant`.                                                                                                                                                                 |
| `currency`                  | No       | Home Assistant currency | ISO 4217 currency code for displayed monetary values. Example: `EUR`, `USD`, or `GBP`.                                                                                                                                                        |
| `locale`                    | No       | Home Assistant language | Language and number format override. Example: `de-DE` or `en-US`. German and English card texts are included.                                                                                                                                 |
| `show_breakdown`            | No       | `true`                  | Shows separate self-consumption and export values. Set `false` for a smaller card.                                                                                                                                                            |
| `show_payback_date`         | No       | `true`                  | Shows the estimated payback date. Set `false` when only the progress is needed.                                                                                                                                                               |
| `show_progress`             | No       | `true`                  | Shows the percentage and progress bar. Set `false` when the financial value is sufficient.                                                                                                                                                    |

## Calculation and data availability

The card calculates the benefit as self-consumed energy times `electricity_price`, plus exported energy times `feed_in_tariff`. It projects the payback date from the average benefit since `start_date`.

During a temporary `unknown` or `unavailable` state, the card uses the latest valid browser-stored reading. It visibly marks cached data and never treats a missing value as zero.

If a cumulative counter briefly reports a lower value, the card keeps the higher cached value. It displays a localized warning that names the affected entity. Changing the selected entities, date, or baselines starts a separate cache scope.

The estimate does not model seasonality, tariff changes, maintenance, financing, or degradation. Use a helper that calculates cumulative monetary benefit when those assumptions need a more detailed model.

## Development

```sh
npm ci
npm run format:check
npm run lint
npm test
npm run build
```
