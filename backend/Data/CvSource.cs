// =========================================================================
// CV content. Single source of truth.
//
// DESIGN NOTES
//
// 1. Static in code, not a database.
//    Content might change; it might not. A database would mean
//    standing up the database, migrations, and an admin UI to serve
//    one document. Git is already the right store — history is the
//    changelog, branches are staging. Tradeoff: edits need a redeploy.
//    At "edits per day" cadence we would move to a JSON object in
//    object storage; only reach for a database when editor count
//    justifies one.
//
// 2. C# instead of a JSON file.
//    Keeping data and schema in one language lets the compiler verify
//    the shape at build time. Rename a DTO field, this file fails to
//    compile until updated. JSON would surface the same bug at request
//    time, much later.
//
// 3. Singleton via DI.
//    Content is immutable for the process lifetime. ICvSource lets us
//    swap in a file-backed or test double implementation later without
//    touching the endpoint.
//
// 4. Inline HTML in strings.
//    A few blocks carry <strong>, <em>, links for inline emphasis.
//    Front end renders with [innerHTML]. Safe because one author, no
//    user-generated input. If editing widens, parse Markdown or run a
//    sanitiser at the API boundary.
// =========================================================================

using BScottCv.Models;

namespace BScottCv.Data;

public interface ICvSource
{
    CvDto Current { get; }
}

public sealed class CvSource : ICvSource
{
    public CvDto Current { get; } = Build();

    private static CvDto Build() => new(
        Header: new HeaderDto(
            Name: "Brandon Scott",
            Tagline: "Full-Stack Software Engineer · Production Web Platforms · Available for Contract",
            Email: "bscott@beconsultants.co",
            Phone: "+1 758 488 5262",
            Location: "Castries, Saint Lucia",
            Links: new[]
            {
                new ContactLinkDto("chatcarib.ai", "https://chatcarib.ai"),
                new ContactLinkDto("B&E Consulting (founder)"),
            },
            PhotoUrl: "/profile.webp"
        ),

        Summary:
            "Full-stack engineer contracting through B&amp;E Consulting from Saint Lucia. I have shipped two production platforms solo — one as a SaaS founder, one for a regional government client — both on the backbone your advert describes: TypeScript on the front end, a typed services back end, JWT auth, and an RDBMS doing real work. I step into active codebases, ship to the milestones agreed, and document for the team that operates the system after I leave. <strong>This page itself is the proof:</strong> an Angular 21 application backed by an ASP.NET Core 8 API, built for this engagement. Source linked in the footer.",

        SelectedWork: new WorkEntryDto[]
        {
            new(
                Id: "chatcarib",
                Title: "ChatCarib — Founder &amp; Architect",
                Meta: "2025 — present · Portfolio project, solo build, end-to-end",
                TitleLink: new ContactLinkDto("chatcarib.ai", "https://chatcarib.ai"),
                Blocks: new ContentBlockDto[]
                {
                    new("paragraph", Html: "I built ChatCarib because I wanted to know — without supervision, without a team to catch me — what real senior production engineering actually feels like."),
                    new("paragraph", Html: "It runs every system a paying SaaS would need: billing, observability, encrypted backups, prompt-injection screening, anti-hallucination architecture. I made every call myself. The calls that mattered most were the ones that <em>rejected</em> the obvious solution:"),
                    new("dashList", Items: new[]
                    {
                        "Replaced naive chunk-RAG after it started fabricating statistics. Built an inline-Markdown virtual-filesystem retrieval pattern instead.",
                        "Isolated subagent context from the coordinator so one agent&rsquo;s mistakes do not poison the others.",
                        "Replaced standard SSE streaming with background tasks plus database polling, so a client disconnect does not kill a long-running query.",
                    }),
                    new("punch", Html: "The deliverable was not a user base. It was the engineering judgment — and that judgment is what I now bring to paid client work."),
                },
                Scope: "<strong>Scope.</strong> ~44,000 LOC. 8 services live on Fly.io. 17 PostgreSQL tables. React 19 + Vite + TypeScript / FastAPI + SQLAlchemy / multi-agent orchestration on LangChain &amp; LangGraph deep-agents / Stripe billing / OpenTelemetry → Arize Phoenix tracing / Docker / GitHub Actions CI/CD."
            ),

            new(
                Id: "bcrc",
                Title: "National Chemicals Database — Lead Consultant (Full-Stack)",
                Meta: "BCRC-Caribbean · UNEP-funded · Government of Saint Lucia · July 2025 — present",
                Blocks: new ContentBlockDto[]
                {
                    new("paragraph", Html: "A USD 34,600 government engagement that was not scoped by technical people. Translating their intent into a system the agencies will actually use is most of the job."),
                    new("punch", Html: "Three deliverables already accepted by BCRC and the Department of Sustainable Development:"),
                    new("dashList", Items: new[]
                    {
                        "the <strong>Baseline Assessment</strong>",
                        "the <strong>National Chemical Profile Protocol</strong>, the governance framework the platform operationalises",
                        "the <strong>Platform Recommendations Report</strong>",
                    }),
                    new("paragraph", Html: "The MOU framework, final platform report, and the platform itself are in active delivery. The first development milestone — the core database modules across all seven of the Protocol&rsquo;s data domains — has been cleared."),
                    new("punch", Html: "The original Terms of Reference were going to fund a throw-away interim system."),
                    new("paragraph", Html: "I made the case to redirect that budget into durable platform deliverables. After the recommendations were reviewed, the project coordinators reauthored the SOW themselves. The engagement now serves the long-term Protocol, not a stopgap that would have been thrown out within a year."),
                    new("paragraph", Html: "The non-technical scoping means a substantial part of the role is translating intent into expandable systems. DSD has endorsed four scope expansions on that basis:"),
                    new("dashList", Items: new[]
                    {
                        "<strong>AI documentation chat and plain-English database querying</strong>, so agencies self-serve in language they already speak.",
                        "<strong>Reporting-automation modules</strong> that take manual BRSM reporting off agencies under existing resource constraints. The pattern generalises to any MEA pipeline.",
                        "<strong>Automated chemical-profile generation</strong> — the Protocol operationalised end-to-end inside the database.",
                        "<strong>1-on-1 stakeholder training in place of group workshops</strong>, so adoption tracks each agency&rsquo;s own pace rather than the slowest in the room.",
                    }),
                },
                Scope: "<strong>Scope.</strong> Built solo across both the chemicals-management and ICT-specialist roles originally specified as two separate engagements. ~46,000 LOC, ~52 PostgreSQL tables, ~111 REST API endpoints. React 19 + TypeScript / FastAPI + Pydantic / PostgreSQL with attribute-based access control, append-only audit log, 8-pass bulk-import validation / Supabase JWT auth with JWKS verification."
            ),

            new(
                Id: "private-sector",
                Title: "Private-sector builds — Operations Consultant &amp; Full-Stack Developer with <a href=\"https://workflowchairman.com\">workflowchairman.com</a>",
                Meta: "2025 — present",
                Blocks: new ContentBlockDto[]
                {
                    new("punch", Html: "The pattern across this work is the only outcome that matters: clients sign off satisfied, and then ask for more work."),
                    new("paragraph", Html: "The &ldquo;more&rdquo; is rarely just another page. It is usually moving existing campaigns, lead-capture forms, and prior-platform contact records into a shared CRM (Go High Level) so leads stop slipping through the cracks between marketing, ordering, and operations. The website gets built. The systems behind it grow."),
                    new("paragraph", Html: "My remit covers website build, funnel-workflow development, and operations consulting across the client roster. Partner studios and team members handle creative direction and client-facing communications."),
                },
                Scope: "<strong>Stack &amp; clients.</strong> React 19 + Vite + TypeScript + Tailwind for the websites; Go High Level workflows, embedded forms, and the lead-routing plumbing for the operations side. Client mix includes a long-standing relationship with Malfinis Film &amp; Animation (since 2019) and its sister company GeoTek Industries Ltd., alongside numerous short-term clients."
            ),
        },

        StackMap: new StackRowDto[]
        {
            new("ASP.NET Core + C#",
                "<strong>The page you are reading runs an ASP.NET Core 8 minimal API as its back end</strong>, written in C#. Typed-services patterns — OOP, dependency injection, middleware — transfer directly from the FastAPI + Pydantic and SQLAlchemy work I do daily."),
            new("Angular + TypeScript",
                "<strong>This page is the Angular 21 build</strong> for this application, TypeScript strict, SCSS. TypeScript itself is production-current across ChatCarib and the BRSM platform."),
            new("PHP",
                "Not in my current stack. The language and the typical LAMP / Laravel deployment topology are familiar; comfortable picking it up where needed."),
            new("JavaScript, CSS, HTML, preprocessors",
                "Production, daily. SCSS in the Angular project; Tailwind across the rest of the portfolio."),
            new("Databases (MySQL / PostgreSQL / MongoDB)",
                "PostgreSQL at an advanced level: pgvector, JSONB, row-level security, audit triggers, attribute-based access control, Alembic migrations, ~52 tables on the BRSM platform. MySQL: SQL fluency cross-applies directly. MongoDB: not yet in production; document model and aggregation pipelines are similar enough to SQL patterns that I work with."),
            new("Git + CI/CD",
                "Daily. GitHub Actions for build and deploy across the portfolio."),
            new("REST + SOAP APIs",
                "REST in production: ~111 endpoints on the BRSM platform, Stripe webhooks on ChatCarib. SOAP not yet in my stack — a different envelope around the same request/response patterns, and adapter libraries are straightforward to integrate."),
            new("OAuth / JWT",
                "Production. Supabase JWT with JWKS verification and OIDC-style flows on the BRSM platform and ChatCarib; the same patterns apply to OAuth providers like Auth0, Google, or Microsoft Identity."),
            new("OOP, design patterns, SDLC",
                "Production. ~46k LOC on BRSM structured under clean domain boundaries; multi-agent orchestration on the deep-agents pattern in ChatCarib; Architecture Decision Records on both platforms."),
            new("Cloud (AWS / Azure / GCP)",
                "Production deployment experience with Fly.io, Cloudflare, Hetzner, and various GPU clouds (including RunPod). IaaS / PaaS fundamentals transfer directly; I am comfortable picking up the AWS, Azure, or GCP control planes."),
            new("Stripe / PayPal (bonus)",
                "Stripe in production: ChatCarib usage billing with credit packs, webhooks, customer portal. PayPal: not in current stack; the merchant flow is similar enough that I would be able to handle it."),
        },

        Education: new EducationEntryDto[]
        {
            new(
                Degree: "BSc Physics",
                Institution: "UWI St. Augustine",
                Dates: "2014 — 2018",
                Qualifier: "(minors in Computer Science and Mathematics)"
            ),
        },

        Other: new OtherEntryDto[]
        {
            new(
                Label: "Lecturer in Physics",
                Body: "Sir Arthur Lewis Community College · 2021 — 2024. Tertiary instruction. Designed course materials, assessments, and an e-learning portal — cross-applies directly to writing documentation operators can actually use."
            ),
            new(
                Label: "Mobility",
                Body: "Valid passport, current US visa, visa-free UK access, CARICOM regional mobility, licensed driver. Available for remote engagement, with on-site where needed."
            ),
        }
    );
}
