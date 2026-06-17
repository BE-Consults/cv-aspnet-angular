// =========================================================================
// Architecture diagram — collapsible Mermaid flowchart of the request flow.
//
// DESIGN NOTES
//
// 1. Lazy-loaded.
//    Mermaid is ~700 KB minified. We dynamic-import it only when the
//    reader expands the panel, so the initial bundle stays tiny. A
//    casual visitor pays zero bytes for this feature.
//
// 2. Auto-expands when inspect mode is on.
//    Tied to InspectModeService — clicking "show source" reveals every
//    other affordance the reader can explore, including this one.
//
// 3. Static SVG, no per-node click handlers.
//    Mermaid's `click` directive emits inline onclick handlers that our
//    CSP (script-src 'self', no 'unsafe-inline') blocks. We render the
//    SVG as a static figure and surface the source paths in the legend
//    underneath as ordinary <a> tags.
// =========================================================================

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { InspectModeService } from './inspect-mode.service';

const REPO_BLOB_URL = 'https://github.com/BE-Consults/cv-aspnet-angular/blob/main/';

// Mermaid source for the architecture flowchart. Edit here and the
// diagram updates on next render.
const DIAGRAM_SOURCE = `
flowchart TB
    Browser["Browser
    https://bscott-cv.beconsultants.co"]
    Edge["Fly.io edge
    IAD region"]
    App["ASP.NET Core 8 minimal API
    one container, scale-to-zero"]
    Source["CvSource singleton
    Data/CvSource.cs"]
    Dto["CvDto + nested DTOs
    Models/Cv.cs"]
    Json["JSON wire payload
    camelCase, omit-null"]
    Service["Angular CvService
    HttpClient → signal"]
    AppC["App component
    @if cv.data; as data"]
    Sections["Section components
    @switch over blocks"]

    Browser -->|HTTPS| Edge
    Edge --> App
    App -->|"GET /api/cv"| Source
    Source --> Dto
    Dto -->|System.Text.Json| Json
    Json -->|response body| Service
    Service --> AppC
    AppC --> Sections
    Sections -->|innerHTML render| Browser
`;

@Component({
  selector: 'cv-architecture-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cv-arch" [class.cv-arch--open]="expanded()">
      <button class="cv-arch__toggle"
              type="button"
              (click)="toggle()"
              [attr.aria-expanded]="expanded()"
              aria-controls="cv-arch-body">
        <span class="cv-arch__title">How this page is wired up</span>
        <span class="cv-arch__chevron" aria-hidden="true">{{ expanded() ? '−' : '+' }}</span>
      </button>

      @if (expanded()) {
        <div id="cv-arch-body" class="cv-arch__body">
          @if (renderError()) {
            <p class="cv-arch__error">Could not render the diagram: {{ renderError() }}</p>
          } @else if (loading()) {
            <p class="cv-arch__loading">Loading Mermaid…</p>
          }

          <div #host class="cv-arch__diagram" aria-label="Architecture diagram"></div>

          <ul class="cv-arch__legend">
            <li>
              <span class="cv-arch__legend-label">Front end</span>
              <a [href]="repo + 'frontend/src/app/cv.service.ts'" target="_blank" rel="noopener noreferrer">cv.service.ts</a>
              <a [href]="repo + 'frontend/src/app/app.ts'" target="_blank" rel="noopener noreferrer">app.ts</a>
            </li>
            <li>
              <span class="cv-arch__legend-label">Back end</span>
              <a [href]="repo + 'backend/Program.cs'" target="_blank" rel="noopener noreferrer">Program.cs</a>
              <a [href]="repo + 'backend/Data/CvSource.cs'" target="_blank" rel="noopener noreferrer">CvSource.cs</a>
              <a [href]="repo + 'backend/Models/Cv.cs'" target="_blank" rel="noopener noreferrer">Cv.cs</a>
            </li>
            <li>
              <span class="cv-arch__legend-label">Deploy</span>
              <a [href]="repo + 'Dockerfile'" target="_blank" rel="noopener noreferrer">Dockerfile</a>
              <a [href]="repo + 'fly.toml'" target="_blank" rel="noopener noreferrer">fly.toml</a>
              <a [href]="repo + '.github/workflows/ci.yml'" target="_blank" rel="noopener noreferrer">ci.yml</a>
            </li>
          </ul>
        </div>
      }
    </section>
  `,
  styles: [`
    .cv-arch {
      margin: 32px 0 24px 0;
      border: 1px solid var(--color-rule, #d0d4d8);
      border-radius: 6px;
      background: white;
    }
    .cv-arch__toggle {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 11pt;
      font-weight: 600;
      color: var(--color-accent, #15314a);
      text-align: left;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    @media (max-width: 480px) {
      .cv-arch__toggle {
        font-size: 10pt;
        padding: 12px 14px;
        letter-spacing: 0.3px;
      }
    }
    .cv-arch__title {
      flex: 1 1 0;
      min-width: 0;
    }
    .cv-arch__toggle:hover {
      background: rgba(21, 49, 74, 0.04);
    }
    .cv-arch__toggle:focus-visible {
      outline: 2px solid var(--color-accent, #15314a);
      outline-offset: -2px;
    }
    .cv-arch--open .cv-arch__toggle {
      border-bottom: 1px solid var(--color-rule, #d0d4d8);
    }
    .cv-arch__chevron {
      font-family: 'JetBrains Mono', Menlo, 'Courier New', monospace;
      font-size: 16pt;
      font-weight: 400;
      color: var(--color-text-muted, #555);
      line-height: 1;
    }
    .cv-arch__body {
      padding: 20px 18px 18px;
    }
    .cv-arch__loading,
    .cv-arch__error {
      font-family: 'JetBrains Mono', Menlo, 'Courier New', monospace;
      font-size: 11px;
      color: var(--color-text-muted, #555);
      margin: 0 0 12px 0;
    }
    .cv-arch__error {
      color: #b00020;
    }
    .cv-arch__diagram {
      display: flex;
      justify-content: center;
      overflow-x: auto;
      margin: 0 0 16px 0;
    }
    .cv-arch__diagram :global(svg) {
      max-width: 100%;
      height: auto;
    }
    .cv-arch__legend {
      list-style: none;
      margin: 0;
      padding: 16px 0 0 0;
      border-top: 1px dashed var(--color-rule, #d0d4d8);
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: 'JetBrains Mono', Menlo, 'Courier New', monospace;
      font-size: 11px;
    }
    .cv-arch__legend li {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 10px;
      align-items: baseline;
    }
    .cv-arch__legend-label {
      flex-shrink: 0;
      color: var(--color-accent, #15314a);
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      min-width: 80px;
    }
    @media (max-width: 560px) {
      .cv-arch__legend li {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        padding-left: 2px;
      }
      .cv-arch__legend-label {
        min-width: 0;
        margin-bottom: 2px;
      }
    }
    .cv-arch__legend a {
      color: var(--color-text, #1a1a1a);
      text-decoration: none;
      border-bottom: 1px dotted var(--color-text-muted, #555);
    }
    .cv-arch__legend a:hover {
      color: var(--color-accent, #15314a);
      border-bottom-color: var(--color-accent, #15314a);
    }
  `],
})
export class ArchitectureDiagramComponent {
  private readonly inspect = inject(InspectModeService);
  private readonly host = viewChild<ElementRef<HTMLDivElement>>('host');

  protected readonly expanded     = signal(false);
  protected readonly loading      = signal(false);
  protected readonly renderError  = signal<string | null>(null);
  protected readonly repo         = REPO_BLOB_URL;

  // Caches the rendered SVG so we don't re-import / re-render if the user
  // collapses and re-expands the panel.
  private cachedSvg: string | null = null;

  constructor() {
    // Auto-expand when inspect mode turns on. Does not auto-collapse;
    // the reader can dismiss explicitly.
    effect(() => {
      if (this.inspect.enabled()) {
        this.expanded.set(true);
      }
    });

    // Render the diagram whenever the panel is open and the view has the
    // target div. The viewChild signal re-fires after the @if puts the
    // host element into the DOM, so the effect re-runs at the right moment.
    effect(async () => {
      if (!this.expanded()) return;
      const el = this.host()?.nativeElement;
      if (!el) return;

      if (this.cachedSvg) {
        el.innerHTML = this.cachedSvg;
        return;
      }

      this.loading.set(true);
      this.renderError.set(null);
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'strict',
          fontFamily: "Inter, system-ui, sans-serif",
        });
        const { svg } = await mermaid.render('cv-arch-svg', DIAGRAM_SOURCE);
        this.cachedSvg = svg;
        el.innerHTML = svg;
      } catch (err) {
        this.renderError.set(err instanceof Error ? err.message : String(err));
      } finally {
        this.loading.set(false);
      }
    });
  }

  toggle(): void {
    this.expanded.update(v => !v);
  }
}
