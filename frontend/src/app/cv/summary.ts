// =========================================================================
// CV summary. Single paragraph rendered via [innerHTML] so inline
// emphasis (<strong>, <em>) in the API payload comes through.
//
// Angular's default sanitiser strips scripts and event handlers but
// allows safe formatting; safe for our trusted single-author content.
//
// The "try this" call-out under the summary points the reader at the
// inspect-mode button. It mirrors the visual language of the source-
// pointer badges deliberately so the connection is obvious: this is the
// affordance that reveals all of those.
// =========================================================================

import { Component, input } from '@angular/core';

@Component({
  selector: 'cv-summary',
  standalone: true,
  template: `
    <section class="cv-section">
      <h2 class="cv-section__heading">Summary</h2>
      <p class="cv-summary" [innerHTML]="text()"></p>

      <aside class="cv-summary__hint" role="note">
        <span class="cv-summary__hint-label">Try this</span>
        <span class="cv-summary__hint-body">
          Click the
          <span class="cv-summary__hint-button">&#123; &#125; show source</span>
          button in the top-right corner. Every section reveals the file
          on the back end that built it and the component on the front
          end that rendered it &mdash; one click takes you to the source on
          GitHub.
        </span>
      </aside>
    </section>
  `,
  styles: [`
    .cv-summary__hint {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: flex-start;
      margin: 14px 0 0 0;
      padding: 12px 14px;
      background: rgba(21, 49, 74, 0.06);
      border-left: 3px solid var(--color-accent, #15314a);
      border-radius: 4px;
      font-family: 'JetBrains Mono', Menlo, 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.55;
      color: var(--color-text, #1a1a1a);
    }
    .cv-summary__hint-label {
      flex-shrink: 0;
      align-self: center;
      background: var(--color-accent, #15314a);
      color: white;
      padding: 3px 9px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .cv-summary__hint-body {
      flex: 1 1 0;
      min-width: 0;
      overflow-wrap: break-word;
    }
    @media (max-width: 480px) {
      .cv-summary__hint {
        flex-direction: column;
        align-items: flex-start;
      }
      .cv-summary__hint-label {
        align-self: flex-start;
      }
    }
    .cv-summary__hint-button {
      display: inline-block;
      padding: 1px 8px;
      background: white;
      border: 1px solid var(--color-rule, #d0d4d8);
      border-radius: 999px;
      font-weight: 600;
      color: var(--color-accent, #15314a);
      white-space: nowrap;
    }
  `],
})
export class SummaryComponent {
  text = input.required<string>();
}
