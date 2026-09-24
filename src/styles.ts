import { css } from "lit";

export const editorStyles = css`
  label {
    display: block;
    margin: 10px 0;
  }
  input,
  select {
    box-sizing: border-box;
    display: block;
    width: 100%;
    min-height: 44px;
    padding: 8px;
  }
  label:has(input[type="checkbox"]) {
    display: flex;
    min-height: 44px;
    align-items: center;
  }
  label:has(input[type="checkbox"]) input {
    display: inline;
    width: 20px;
    min-height: 20px;
    margin-inline-end: 8px;
  }
  .advanced-toggle {
    display: flex;
    width: 100%;
    min-height: 44px;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding: 8px 0;
    border: 0;
    background: transparent;
    color: var(--primary-color);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .advanced-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  .advanced-settings {
    padding-top: 4px;
    border-top: 1px solid var(--divider-color);
  }
  .advanced-settings p {
    margin: 8px 0 12px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .individual-consumers {
    margin: 18px 0;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color);
  }
  .individual-consumers h3 {
    margin: 0 0 6px;
    font-size: 1em;
  }
  .individual-consumers p {
    margin: 0 0 12px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .individual-consumers fieldset {
    margin: 12px 0;
    padding: 8px 12px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }
  .individual-consumers legend {
    padding: 0 4px;
    font-weight: 600;
  }
  .add-consumer,
  .remove-consumer {
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--primary-color);
    background: transparent;
    color: var(--primary-color);
    border-radius: 6px;
    font: inherit;
    cursor: pointer;
  }
  .remove-consumer {
    border-color: var(--error-color, #db4437);
    color: var(--error-color, #db4437);
  }
`;

export const cardStyles = css`
  .scenario-trigger {
    padding: 0;
    border: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    font: inherit;
    font-weight: inherit;
    border-radius: 4px;
    cursor: pointer;
  }
  .scenario-trigger:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
  }
  :host {
    display: block;
  }
  .content {
    padding: 16px;
    color: var(--primary-text-color);
  }
  .content.compact {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 16px;
  }
  .compact .header {
    grid-row: 1;
    grid-column: 1 / -1;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.1em;
    font-weight: 600;
  }
  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .header-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-progress {
    color: var(--primary-color);
    font-size: 1.545em;
    white-space: nowrap;
  }
  ha-icon {
    color: var(--primary-color);
  }
  .warning-indicator {
    display: inline-flex;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--warning-color, #ff9800);
    cursor: pointer;
    font: inherit;
  }
  .warning-indicator ha-icon {
    color: inherit;
  }
  .warning-indicator:focus-visible {
    outline: 2px solid var(--warning-color, #ff9800);
    outline-offset: 3px;
    border-radius: 4px;
  }
  .benefit {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 22px 0 12px;
  }
  .benefit strong {
    font-size: 1.7em;
  }
  .compact .benefit {
    grid-row: 2;
    grid-column: 1;
    justify-content: flex-start;
    min-width: 0;
    margin: 16px 0 10px;
  }
  .compact .benefit strong {
    max-width: 100%;
    overflow: hidden;
    font-size: 1.15em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .compact .benefit span,
  .compact .date span,
  .compact .breakdown span {
    display: none;
  }
  .date {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 12px;
    margin: 18px 0 6px;
  }
  .progress-trigger {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: help;
  }
  .progress-trigger:focus-visible {
    outline: none;
  }
  .bar {
    display: flex;
    width: 100%;
    height: 10px;
    background: var(--secondary-background-color);
    border-radius: 99px;
    overflow: hidden;
  }
  .compact .progress-trigger {
    grid-row: 3;
    grid-column: 1 / -1;
  }
  .progress-trigger:focus-visible .bar {
    outline: 2px solid var(--primary-color);
    outline-offset: 3px;
  }
  .bar > span {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--info-color, #03a9f4) 0%,
      var(--success-color, #4caf50) 100%
    );
    border-radius: inherit;
    transition: width 0.2s;
  }
  .bar.contribution-segments {
    display: flex;
  }
  .bar.contribution-segments > span {
    flex-shrink: 0;
    border-radius: 0;
  }
  .bar.contribution-segments .contribution-own {
    background: var(--info-color, #03a9f4);
    border-radius: 99px 0 0 99px;
  }
  .bar.contribution-segments .contribution-export {
    background: var(--success-color, #4caf50);
    border-radius: 0 99px 99px 0;
  }
  .contribution-percentages {
    display: flex;
    width: 100%;
    margin-top: 6px;
    font-size: 0.78em;
    font-weight: 600;
    line-height: 1;
  }
  .contribution-percentages > span {
    flex-shrink: 0;
    overflow: visible;
    text-align: center;
    white-space: nowrap;
  }
  .contribution-percentage-own {
    color: var(--info-color, #03a9f4);
  }
  .contribution-percentage-export {
    color: var(--success-color, #4caf50);
  }
  .progress-tooltip {
    position: absolute;
    z-index: 2;
    bottom: calc(100% + 10px);
    inset-inline-start: 50%;
    display: grid;
    width: max-content;
    max-width: min(320px, calc(100vw - 48px));
    gap: 6px;
    padding: 10px 12px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    box-shadow: 0 3px 10px rgb(0 0 0 / 24%);
    border-radius: 8px;
    opacity: 0;
    pointer-events: none;
    text-align: start;
    transform: translateX(-50%) translateY(4px);
    transition:
      opacity 0.15s ease,
      transform 0.15s ease,
      visibility 0.15s ease;
    visibility: hidden;
  }
  .progress-tooltip::after {
    position: absolute;
    top: 100%;
    inset-inline-start: 50%;
    width: 8px;
    height: 8px;
    border-inline-end: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    content: "";
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .progress-trigger:hover .progress-tooltip,
  .progress-trigger:focus-visible .progress-tooltip,
  .progress-trigger.tooltip-open .progress-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    visibility: visible;
  }
  .tooltip-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 18px;
    white-space: nowrap;
  }
  .tooltip-row.tooltip-own {
    color: var(--info-color, #03a9f4);
  }
  .tooltip-row.tooltip-export {
    color: var(--success-color, #4caf50);
  }
  .tooltip-row.tooltip-individual {
    color: var(--primary-text-color);
  }
  .breakdown {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 18px;
  }
  .compact .breakdown {
    grid-row: 4;
    grid-column: 1 / -1;
    margin-top: 12px;
  }
  .compact .breakdown b {
    display: block;
    overflow: hidden;
    font-size: 0.82em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .breakdown div,
  .breakdown-action {
    display: grid;
    gap: 4px;
  }
  .breakdown span,
  .date span,
  .benefit span {
    color: var(--secondary-text-color);
  }
  .breakdown b {
    font-size: 0.92em;
  }
  .breakdown-label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .breakdown-label ha-icon {
    width: 18px;
    height: 18px;
    color: inherit;
  }
  .breakdown-action {
    padding: 0;
    border: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
  }
  .breakdown-action:not(:disabled) {
    cursor: pointer;
  }
  .breakdown-action:not(:disabled):focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
    border-radius: 4px;
  }
  .breakdown.contribution-segments .own,
  .breakdown.contribution-segments .own span,
  .breakdown.contribution-segments .own b {
    color: var(--info-color, #03a9f4);
  }
  .breakdown.contribution-segments .export,
  .breakdown.contribution-segments .export span,
  .breakdown.contribution-segments .export b {
    color: var(--success-color, #4caf50);
  }
  .date b,
  .date .scenario-trigger {
    text-align: end;
  }
  .compact .date {
    grid-row: 2;
    grid-column: 2;
    align-items: baseline;
    justify-content: flex-end;
    min-width: 0;
    margin: 16px 0 10px;
  }
  .compact .date b,
  .compact .date .scenario-trigger {
    max-width: 100%;
    overflow: hidden;
    font-size: 1.15em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status-only {
    min-height: 24px;
  }
  .warning-dialog-message {
    max-width: 520px;
    white-space: pre-wrap;
  }
  .scenario-dialog {
    display: grid;
    width: min(920px, calc(100vw - 48px));
    max-width: 100%;
    gap: 12px;
    min-width: min(760px, calc(100vw - 48px));
    padding-bottom: 8px;
  }
  .scenario {
    --scenario-color: var(--secondary-text-color, #727272);
    padding: 14px;
    border: 2px solid var(--scenario-color);
    background: var(--secondary-background-color);
    background: color-mix(in srgb, var(--scenario-color) 12%, var(--card-background-color, #fff));
    border-radius: 12px;
  }
  .scenario-seasonal {
    --scenario-color: var(--success-color, #4caf50);
  }
  .scenario-discounted {
    --scenario-color: var(--info-color, #03a9f4);
  }
  .scenario-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .scenario-heading ha-icon {
    color: var(--scenario-color);
  }
  .scenario h3 {
    margin: 0;
    font-size: 1em;
  }
  .scenario-rate,
  .scenario-values span {
    color: var(--secondary-text-color);
  }
  .scenario-warning {
    display: flex;
    justify-content: flex-end;
  }
  .scenario-rate {
    margin: -4px 0 10px;
    font-size: 0.88em;
  }
  .scenario-values {
    display: grid;
    grid-template-columns: minmax(100px, 0.8fr) repeat(3, minmax(120px, 1fr));
    gap: 12px;
  }
  .scenario-values div {
    display: grid;
    min-width: 0;
    gap: 4px;
  }
  .scenario-values span {
    font-size: 0.88em;
    line-height: 1.25;
  }
  .scenario-values strong {
    overflow-wrap: anywhere;
  }
  .scenario-values strong:last-child {
    text-align: end;
  }
  @media (max-width: 520px) {
    .scenario-dialog {
      width: auto;
      min-width: 0;
    }
    .scenario-values {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 360px) {
    .breakdown {
      grid-template-columns: 1fr;
    }
    .date,
    .benefit {
      align-items: start;
      flex-direction: column;
      gap: 4px;
    }
    .date b,
    .date .scenario-trigger {
      text-align: start;
    }
    .content.compact .breakdown {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .content.compact .date,
    .content.compact .benefit {
      align-items: baseline;
      flex-direction: row;
      gap: 0;
    }
    .content.compact .date b,
    .content.compact .date .scenario-trigger {
      text-align: end;
    }
    .scenario-values {
      grid-template-columns: 1fr;
    }
    .scenario-values strong:last-child {
      text-align: start;
    }
  }
`;
