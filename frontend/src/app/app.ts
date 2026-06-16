// =========================================================================
// App root. Orchestrates the load lifecycle and renders one of three
// states: loading, error, or the populated CV.
//
// The page composition (header, summary, work entries, etc.) gets added
// here in the next pass; for now we dump the loaded JSON to confirm the
// end-to-end fetch works.
// =========================================================================

import { Component, inject } from '@angular/core';

import { CvService } from './cv.service';
import { SpinnerComponent } from './cv/spinner';
import { ErrorBannerComponent } from './cv/error-banner';
import { HeaderComponent } from './cv/header';
import { SummaryComponent } from './cv/summary';
import { SelectedWorkComponent } from './cv/selected-work';
import { StackMapComponent } from './cv/stack-map';
import { EducationComponent } from './cv/education';
import { OtherComponent } from './cv/other';
import { FooterComponent } from './cv/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SpinnerComponent,
    ErrorBannerComponent,
    HeaderComponent,
    SummaryComponent,
    SelectedWorkComponent,
    StackMapComponent,
    EducationComponent,
    OtherComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected cv = inject(CvService);

  constructor() {
    this.cv.load();
  }
}
