import { Component, input } from '@angular/core';
import { OtherEntry } from '../models/cv.model';

@Component({
  selector: 'cv-other',
  standalone: true,
  template: `
    <section class="cv-section">
      <h2 class="cv-section__heading">Other</h2>
      @for (entry of entries(); track entry.label) {
        <p class="cv-other-line">
          <strong>{{ entry.label }}.</strong> {{ entry.body }}
        </p>
      }
    </section>
  `,
})
export class OtherComponent {
  entries = input.required<OtherEntry[]>();
}
