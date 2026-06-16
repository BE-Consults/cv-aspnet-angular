// =========================================================================
// Selected work section. Iterates work entries and delegates the per-
// entry rendering to <cv-work-entry>.
// =========================================================================

import { Component, input } from '@angular/core';
import { WorkEntry } from '../models/cv.model';
import { WorkEntryComponent } from './work-entry';

@Component({
  selector: 'cv-selected-work',
  standalone: true,
  imports: [WorkEntryComponent],
  template: `
    <section class="cv-section">
      <h2 class="cv-section__heading">Selected work</h2>
      @for (entry of entries(); track entry.id) {
        <cv-work-entry [entry]="entry" />
      }
    </section>
  `,
})
export class SelectedWorkComponent {
  entries = input.required<WorkEntry[]>();
}
