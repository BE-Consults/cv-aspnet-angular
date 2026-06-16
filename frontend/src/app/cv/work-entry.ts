// =========================================================================
// One work entry. Renders the heterogeneous block list (paragraph,
// punch, dashList) from the API payload.
//
// The @switch on block.type narrows the discriminated union inside each
// @case branch — Angular 17+ template type-checker handles this
// correctly for string-literal discriminators on a union.
// =========================================================================

import { Component, input } from '@angular/core';
import { WorkEntry } from '../models/cv.model';

@Component({
  selector: 'cv-work-entry',
  standalone: true,
  templateUrl: './work-entry.html',
})
export class WorkEntryComponent {
  entry = input.required<WorkEntry>();
}
