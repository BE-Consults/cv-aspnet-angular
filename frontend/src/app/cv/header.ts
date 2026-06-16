// =========================================================================
// CV header. Name, tagline, contact line, photo.
//
// Required input via `input.required<T>()` — see error-banner.ts for the
// design note on the new signal-based I/O.
// =========================================================================

import { Component, input } from '@angular/core';
import { HeaderData } from '../models/cv.model';

@Component({
  selector: 'cv-header',
  standalone: true,
  templateUrl: './header.html',
})
export class HeaderComponent {
  data = input.required<HeaderData>();
}
