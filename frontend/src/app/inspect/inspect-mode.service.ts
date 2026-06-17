// =========================================================================
// Inspect-mode toggle service.
//
// Global signal-based switch. When `enabled()` is true, the source-pointer
// badges render above each section and the architecture panel expands by
// default. Off by default — the page reads as a normal CV until the
// reader opts into the walk-through.
// =========================================================================

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InspectModeService {
  private readonly _enabled = signal(false);

  /** Read-only signal — components subscribe to this for reactivity. */
  readonly enabled = this._enabled.asReadonly();

  toggle(): void {
    this._enabled.update(v => !v);
  }
}
