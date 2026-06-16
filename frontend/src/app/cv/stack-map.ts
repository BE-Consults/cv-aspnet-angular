// =========================================================================
// Stack requirement → my evidence table. The visible centrepiece of
// the page for a hiring manager scanning to see whether each ad
// requirement is covered.
// =========================================================================

import { Component, input } from '@angular/core';
import { StackRow } from '../models/cv.model';

@Component({
  selector: 'cv-stack-map',
  standalone: true,
  template: `
    <section class="cv-section">
      <h2 class="cv-section__heading">Stack — mapped to the role</h2>
      <table class="cv-stack">
        <tbody>
          @for (row of rows(); track row.label) {
            <tr>
              <td class="cv-stack__label">{{ row.label }}</td>
              <td [innerHTML]="row.description"></td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class StackMapComponent {
  rows = input.required<StackRow[]>();
}
