// =========================================================================
// App-wide DI providers.
//
// provideHttpClient(withFetch()) — use the browser fetch API instead of
// XMLHttpRequest. SSR-safe and works in modern Node runtimes; no real
// downside in 2026.
// =========================================================================

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ]
};
