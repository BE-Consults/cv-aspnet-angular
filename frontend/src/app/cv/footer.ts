// =========================================================================
// Footer. Links to the public GitHub repo so the reviewer can read the
// codebase — the secondary proof beyond the rendered page.
//
// Repo URL is hard-coded for now; will become an env-built value if we
// ever fork the site for other contract applications.
// =========================================================================

import { Component } from '@angular/core';

@Component({
  selector: 'cv-footer',
  standalone: true,
  template: `
    <footer class="cv-footer">
      <div class="cv-footer__links">
        <a href="https://github.com/be-consults/cv-aspnet-angular" target="_blank" rel="noopener">
          Source on GitHub
        </a>
        <a href="/api/cv" target="_blank" rel="noopener">Raw JSON</a>
      </div>
      <div>
        Angular 21 · ASP.NET Core 8 · built for this application.
      </div>
    </footer>
  `,
})
export class FooterComponent {}
