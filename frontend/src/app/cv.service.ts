// =========================================================================
// CV service. Owns the load-from-API state machine.
//
// DESIGN NOTES
//
// 1. Signals over RxJS.
//    One-shot fetch. No streaming, no operator chains. Signals give us
//    less code, less new vocabulary, and the direction Angular itself
//    is moving in. If a future feature needs a stream (live search,
//    websocket, debounce), we wrap that Observable into a signal at the
//    boundary and keep the rest of the app signal-driven.
//
// 2. Discriminated union for state.
//    `idle | loading | success | error` are mutually exclusive. A
//    boolean-soup model (isLoading, isError, hasData) lets impossible
//    combinations compile (`isLoading && isError === true`). The union
//    closes that off — the type itself enforces "exactly one state at
//    a time."
//
// 3. No silent fallback to stale or static data.
//    On error we surface an explicit error state with a retry. A
//    fallback that pretends success would hide back-end failures and
//    contract drift; the user needs to know the system is degraded so
//    they can act, and we need the error to surface so we can diagnose.
//
// 4. Computed signals over template-side narrowing.
//    Angular templates do not narrow discriminated unions reliably.
//    We pre-compute `isLoading / isError / data / errorMessage` here so
//    templates stay type-safe and dumb: `@if (cv.data(); as data) { ... }`.
// =========================================================================

import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { CvData } from './models/cv.model';

export type CvState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: CvData }
  | { status: 'error'; message: string };

@Injectable({ providedIn: 'root' })
export class CvService {
  private http = inject(HttpClient);

  private _state = signal<CvState>({ status: 'idle' });
  readonly state = this._state.asReadonly();

  readonly isLoading = computed(() => this._state().status === 'loading');
  readonly isError = computed(() => this._state().status === 'error');

  readonly data = computed<CvData | null>(() => {
    const s = this._state();
    return s.status === 'success' ? s.data : null;
  });

  readonly errorMessage = computed<string>(() => {
    const s = this._state();
    return s.status === 'error' ? s.message : '';
  });

  load(): void {
    this._state.set({ status: 'loading' });
    this.http.get<CvData>('/api/cv').subscribe({
      next: (data) => this._state.set({ status: 'success', data }),
      error: (err) => this._state.set({ status: 'error', message: formatError(err) }),
    });
  }
}

// User-facing messages, not stack traces. We surface enough for the
// user to know what to try next (refresh, wait, contact us) without
// leaking server internals.
function formatError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'Could not reach the CV service. The back end may be offline.';
    }
    return `Request failed (HTTP ${err.status}). Please try again in a moment.`;
  }
  return 'Something went wrong while loading the CV. Please try again.';
}
