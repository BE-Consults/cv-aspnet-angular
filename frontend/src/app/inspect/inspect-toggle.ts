// =========================================================================
// Inspect-mode toggle button.
//
// A small floating pill in the top-right corner. Off by default; click to
// reveal the source-pointer badges and the architecture diagram.
//
// The reason this lives in a dedicated component rather than the header:
// it should sit above the page rather than inside the document flow, so
// it can stay reachable even when the reader has scrolled past the
// header.
// =========================================================================

import { Component, inject } from '@angular/core';
import { InspectModeService } from './inspect-mode.service';

@Component({
  selector: 'cv-inspect-toggle',
  template: `
    <button class="cv-inspect-toggle"
            [class.cv-inspect-toggle--on]="svc.enabled()"
            (click)="svc.toggle()"
            type="button"
            [attr.aria-pressed]="svc.enabled()"
            aria-label="Toggle source inspector">
      <span class="cv-inspect-toggle__icon" aria-hidden="true">&#123; &#125;</span>
      <span class="cv-inspect-toggle__label">{{ svc.enabled() ? 'hide source' : 'show source' }}</span>
    </button>
  `,
  styles: [`
    .cv-inspect-toggle {
      position: fixed;
      top: 16px;
      right: 16px;
      background: white;
      border: 1px solid var(--color-rule, #d0d4d8);
      padding: 8px 14px 8px 12px;
      border-radius: 999px;
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-muted, #555);
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      z-index: 100;
      transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    }
    .cv-inspect-toggle:hover {
      border-color: var(--color-accent, #15314a);
      color: var(--color-accent, #15314a);
    }
    .cv-inspect-toggle:focus-visible {
      outline: 2px solid var(--color-accent, #15314a);
      outline-offset: 2px;
    }
    .cv-inspect-toggle--on {
      background: var(--color-accent, #15314a);
      color: white;
      border-color: var(--color-accent, #15314a);
    }
    .cv-inspect-toggle--on:hover {
      color: white;
      filter: brightness(1.1);
    }
    .cv-inspect-toggle__icon {
      font-family: 'JetBrains Mono', Menlo, 'Courier New', monospace;
      font-weight: 700;
      letter-spacing: -2px;
    }

    /* Compact on narrow screens — keep the icon, drop the label. */
    @media (max-width: 480px) {
      .cv-inspect-toggle {
        padding: 8px 12px;
      }
      .cv-inspect-toggle__label {
        display: none;
      }
    }
  `],
})
export class InspectToggleComponent {
  protected readonly svc = inject(InspectModeService);
}
