# Changelog

## Unreleased

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
