import { Component, input } from '@angular/core';
import { EducationEntry } from '../models/cv.model';

@Component({
  selector: 'cv-education',
  standalone: true,
  template: `
    <section class="cv-section">
      <h2 class="cv-section__heading">Education</h2>
      @for (entry of entries(); track entry.degree) {
        <p class="cv-education-line">
          <strong>{{ entry.degree }}</strong>
          @if (entry.qualifier) {
            {{ entry.qualifier }}
          }
          · {{ entry.institution }} · {{ entry.dates }}
        </p>
      }
    </section>
  `,
})
export class EducationComponent {
  entries = input.required<EducationEntry[]>();
}
