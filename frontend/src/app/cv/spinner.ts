// =========================================================================
// Loading spinner. CSS-only, no library.
//
// One tiny component, no template file. Inline styles keep the entire
// thing self-contained so it can be dropped anywhere without thinking
// about global stylesheet leakage.
// =========================================================================

import { Component } from '@angular/core';

@Component({
  selector: 'cv-spinner',
  standalone: true,
  template: `
    <div class="cv-spinner" role="status" aria-live="polite" aria-label="Loading">
      <div class="cv-spinner__ring"></div>
    </div>
  `,
  styles: [`
    .cv-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }
    .cv-spinner__ring {
      width: 48px;
      height: 48px;
      border: 4px solid var(--color-rule-soft);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: cv-spin 0.9s linear infinite;
    }
    @keyframes cv-spin {
      to { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .cv-spinner__ring { animation-duration: 2.5s; }
    }
  `],
})
export class SpinnerComponent {}
