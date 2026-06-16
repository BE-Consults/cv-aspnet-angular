# cv-aspnet-angular

My CV as a live web application. An Angular 21 front end backed by an
ASP.NET Core 8 minimal API, with the CV content as the single source
of truth in C#. Built as a reusable portfolio piece — the content is
swapped per application; the architecture stays.

> **Live:** _coming soon — deploys to Fly.io_

## Stack

- **Front end:** Angular 21, TypeScript strict, SCSS
- **Back end:** ASP.NET Core 8 minimal API, C# 12
- **Deploy:** single Docker image, ASP.NET serves both the static
  Angular bundle and the `/api/*` endpoints

## Run locally

Requires Node 24, pnpm 10, and the .NET 8 SDK.

```bash
# Terminal 1 — back end on :5260
cd backend
dotnet run

# Terminal 2 — front end on :4200 (proxies /api/* to the back end)
cd frontend
pnpm install
pnpm start
```

Open <http://localhost:4200>.

## Architecture

```
Browser ──► Angular SPA bundle
              │
              ▼  /api/cv
            ASP.NET Core minimal API
              │
              ▼
            CvSource (singleton, content as C# data)
```

In production both halves ship as one Docker image: the ASP.NET app
serves the Angular bundle from `wwwroot/` and the `/api/*` endpoints
from minimal-API handlers. Same origin, no CORS.

In development they run separately; the Angular dev server proxies
`/api/*` through to the back end.

## Why the content is in C#, not a database

Content updates a few times a year. A database would mean standing
up the database, migrations, and an admin UI to serve one document.
Git is already the right store — version history is the changelog,
branches are staging. See `backend/Data/CvSource.cs` for the full
rationale.

Every architecturally interesting choice in the codebase carries an
inline design-note comment at the top of its file. Read those for
the **why** of each pattern.

## Reframing for another application

The content lives entirely in `backend/Data/CvSource.cs`. Editing the
populated DTO there is the only change required to retarget the site
at a different role. The compile step catches any DTO field rename
or shape change at build time, so a content edit cannot silently
break the page.

Branches are the natural staging mechanism: a `role/<name>` branch
per application, merged when the version is ready to ship.
