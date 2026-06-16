// =========================================================================
// Error display with retry.
//
// Signal inputs (input.required) and output() are the Angular 21
// component-IO style. The parent passes the message in and listens for
// the (retry) event; this component does not know how to load the CV,
// only how to ask for another attempt.
// =========================================================================

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'cv-error-banner',
  standalone: true,
  template: `
    <div class="cv-error" role="alert">
      <p class="cv-error__message">{{ message() }}</p>
      <button class="cv-error__retry" type="button" (click)="retry.emit()">
        Try again
      </button>
    </div>
  `,
  styles: [`
    .cv-error {
      max-width: 480px;
      margin: 15vh auto;
      padding: 24px 28px;
      border: 1px solid var(--color-rule);
      border-radius: 8px;
      background: var(--color-bg-soft);
      text-align: center;
    }
    .cv-error__message {
      margin: 0 0 18px 0;
      color: var(--color-text);
      line-height: 1.5;
    }
    .cv-error__retry {
      background: var(--color-accent);
      color: #fff;
      border: none;
      padding: 10px 22px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
    }
    .cv-error__retry:hover {
      background: var(--color-accent-soft);
    }
  `],
})
export class ErrorBannerComponent {
  message = input.required<string>();
  retry = output<void>();
}
