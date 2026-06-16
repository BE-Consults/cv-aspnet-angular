// =========================================================================
// CV summary. Single paragraph rendered via [innerHTML] so inline
// emphasis (<strong>, <em>) in the API payload comes through.
//
// Angular's default sanitiser strips scripts and event handlers but
// allows safe formatting; safe for our trusted single-author content.
// =========================================================================

import { Component, input } from '@angular/core';

@Component({
  selector: 'cv-summary',
  standalone: true,
  template: `
    <section class="cv-section">
      <h2 class="cv-section__heading">Summary</h2>
      <p class="cv-summary" [innerHTML]="text()"></p>
    </section>
  `,
})
export class SummaryComponent {
  text = input.required<string>();
}
