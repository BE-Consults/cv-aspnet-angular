// =========================================================================
// Source-pointer badge.
//
// Renders a small monospaced badge above a section when inspect mode is
// on. Backend and frontend files become clickable GitHub deep-links so
// the reader can jump from "what they see" to "where it comes from" in
// one click.
//
// Hidden entirely when inspect mode is off — no DOM, no a11y noise.
// =========================================================================

import { Component, inject, input } from '@angular/core';
import { InspectModeService } from './inspect-mode.service';
import { SourceMeta } from './source-meta';

const REPO_BLOB_URL = 'https://github.com/BE-Consults/cv-aspnet-angular/blob/main/';

@Component({
  selector: 'cv-source-pointer',
  template: `
    @if (svc.enabled()) {
      <div class="cv-source-pointer" role="note" aria-label="Source location">
        <span class="cv-source-pointer__label">{{ meta().label }}</span>
        @if (meta().backendFile) {
          <a class="cv-source-pointer__link"
             [href]="repo + meta().backendFile"
             target="_blank"
             rel="noopener noreferrer">
            {{ meta().backendFile }}@if (meta().backendSymbol) {<span class="cv-source-pointer__symbol">#{{ meta().backendSymbol }}</span>}
          </a>
        }
        @if (meta().backendFile && meta().frontendFile) {
          <span class="cv-source-pointer__arrow" aria-hidden="true">→</span>
        }
        @if (meta().frontendFile) {
          <a class="cv-source-pointer__link"
             [href]="repo + meta().frontendFile"
             target="_blank"
             rel="noopener noreferrer">
            {{ meta().frontendFile }}
          </a>
        }
      </div>
    }
  `,
  styles: [`
    .cv-source-pointer {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: baseline;
      font-family: 'JetBrains Mono', Menlo, 'Courier New', monospace;
      font-size: 11px;
      color: var(--color-text-muted, #555);
      margin: 0 0 12px 0;
      padding: 6px 10px;
      background: rgba(21, 49, 74, 0.04);
      border-radius: 4px;
      border-left: 3px solid var(--color-accent, #15314a);
      line-height: 1.5;
      max-width: 100%;
      overflow-wrap: anywhere;
    }
    .cv-source-pointer__label {
      color: var(--color-accent, #15314a);
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-right: 4px;
      flex-shrink: 0;
    }
    .cv-source-pointer__link {
      color: var(--color-text, #1a1a1a);
      text-decoration: none;
      border-bottom: 1px dotted var(--color-text-muted, #555);
      overflow-wrap: anywhere;
      min-width: 0;
    }
    .cv-source-pointer__link:hover {
      color: var(--color-accent, #15314a);
      border-bottom-color: var(--color-accent, #15314a);
    }
    .cv-source-pointer__symbol {
      color: var(--color-accent, #15314a);
    }
    .cv-source-pointer__arrow {
      color: var(--color-text-muted, #555);
    }
    @media (max-width: 560px) {
      .cv-source-pointer {
        flex-direction: column;
        align-items: flex-start;
        gap: 3px;
        padding: 7px 10px;
      }
      .cv-source-pointer__arrow {
        display: none;
      }
      .cv-source-pointer__link {
        word-break: break-all;
        line-height: 1.4;
      }
    }
    @media (max-width: 380px) {
      .cv-source-pointer {
        font-size: 10px;
      }
    }
  `],
})
export class SourcePointerComponent {
  protected readonly svc = inject(InspectModeService);
  readonly meta = input.required<SourceMeta>();
  protected readonly repo = REPO_BLOB_URL;
}
