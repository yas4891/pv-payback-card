# Changelog

## Unreleased

## 0.3.1 - 2026-08-29

- Added a localized scenario comparison dialog for the displayed benefit and estimated payback date.
- Added linear, seasonal, and seasonally discounted values to every scenario comparison.
- Added a clearly marked 3% comparison rate when no annual discount rate is configured.
- Kept the main card nominal until an annual discount rate is explicitly configured.

## 0.3.0 - 2026-08-29

- Added an optional location-aware seasonal payback forecast using the configured Home Assistant location.
- Added an optional annual discount rate for benefit, contribution, progress, and payback calculations.
- Added optional daily recorder statistics for placing discounted historical cashflows on their actual days.
- Added shared statistics and calculation caches to reduce Home Assistant and browser load.
- Added automatic approximation fallbacks when location data or recorder statistics are unavailable.
- Added visual-editor controls and README guidance for every new forecasting option.

## 0.2.1 - 2026-08-29

- Replaced the cached-data notice with a yellow warning icon beside the payback percentage.
- Added a hover tooltip with the cached-data timestamp and warning details.
- Increased the payback percentage to match the benefit value size.
- Added card screenshots and linked the multi-inverter helper guide from the README.

## 0.2.0 - 2026-08-28

- Added an optional production-energy input that calculates self-consumption from production minus export.
- Kept direct self-consumption as the preferred input when both models are configured.
- Added separate cache scopes and warnings for production-based energy input.
- Added an optional blue and green contribution-segment progress bar.
- Added clickable more-info dialogs for configured self-consumption and export entities.
- Moved the payback percentage into the header beside the localized card title.
- Removed the redundant payback label above the progress bar.

## 0.1.2 - 2026-08-28

- Added optional energy and monetary values in the breakdown.
- Rounded energy values to whole kWh.
- Added a blue-to-green payback progress gradient.
- Localized the default card title and updated the default icon.
- Localize the former generated card title `PV-Amortisation` again.
- Fixed the visual editor to load existing configuration values.
- Fixed duplicate labels in energy entity selectors.

## 0.1.0

- Initial HACS-ready release.
- Configurable financial inputs and cumulative energy entities.
- German and English card rendering.
