// =========================================================================
// CV API entry point.
//   GET /api/cv      — populated CvDto
//   GET /api/health  — readiness probe
//
// DESIGN NOTES
//
// 1. Minimal API, not Controllers.
//    Two endpoints, no model binding, no auth. Controllers would be
//    ceremony. Reach for Controllers when we add request bodies, auth
//    policies, or per-route conventions.
//
// 2. CORS only in development.
//    Production runs front end and API behind the same hostname; no
//    CORS. The Angular dev server (:4200) calls this API (:5260) cross-
//    origin in dev, hence the explicit allow. Belt-and-braces with the
//    Angular proxy.conf.json that forwards /api/* to the back end —
//    either alone is sufficient; we keep both.
//
// 3. JSON: camelCase + omit nulls.
//    camelCase is the ASP.NET Core default and matches JS / TS
//    convention. Omit-null keeps optional fields (TitleLink, Url) out
//    of the wire format so the TS optional-fields shape matches the
//    JSON exactly.
//
// 4. CvSource as singleton.
//    Content is immutable for process lifetime — see Data/CvSource.cs.
//
// 5. Serves the Angular bundle from wwwroot/.
//    Production ships as a single image: ASP.NET serves the static
//    Angular bundle plus the /api/* endpoints. UseDefaultFiles maps / to
//    /index.html, UseStaticFiles serves anything under wwwroot/, and
//    MapFallbackToFile lets the SPA handle client-side routes by
//    returning index.html for any path that did not match an endpoint
//    or static file. Order matters — static middleware must come before
//    the endpoint mapping; the fallback must come after.
//
// 6. Hardening.
//    The CV data is public by design, so confidentiality is not a
//    concern. The remaining surface is availability and fingerprinting:
//      - Per-IP rate limit on /api/cv (60 req/min, fixed window). Stops
//        casual hammering of the endpoint from chewing through the
//        Fly free-tier bandwidth.
//      - Server: Kestrel response header off. Small reduction in stack
//        fingerprinting.
//      - HTTPS forced at the Fly edge; HSTS instructs browsers to lock
//        the protocol in production.
//      - CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
//        on every response. Frame-Ancestors 'none' replaces the legacy
//        XFO header for browsers that support CSP Level 2.
//      - Forwarded headers honoured so the rate-limit partition keys
//        on the real client IP, not the Fly proxy IP.
// =========================================================================

using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using BScottCv.Data;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

const string DevCorsPolicy = "AllowAngularDev";
const string ApiRateLimit  = "api";

// Strip the "Server: Kestrel" response header so the stack is not
// advertised in every response.
builder.WebHost.ConfigureKestrel(o => o.AddServerHeader = false);

// Honour X-Forwarded-* from the Fly edge proxy so RemoteIpAddress
// resolves to the real client IP — required for per-IP rate limiting.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(DevCorsPolicy, policy => policy
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.DefaultIgnoreCondition =
        JsonIgnoreCondition.WhenWritingNull;
});

// 60 requests / minute per client IP. Fixed window; no queue — extra
// requests get 429 immediately rather than backing up.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy(ApiRateLimit, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit          = 60,
                Window               = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit           = 0,
            }));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<ICvSource, CvSource>();

var app = builder.Build();

app.UseForwardedHeaders();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

// Common security headers on every response.
app.Use(async (context, next) =>
{
    var h = context.Response.Headers;
    h["X-Content-Type-Options"] = "nosniff";
    h["X-Frame-Options"]        = "DENY";
    h["Referrer-Policy"]        = "strict-origin-when-cross-origin";
    h["Content-Security-Policy"] =
        "default-src 'self'; "
      + "script-src 'self'; "
      + "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
      + "font-src 'self' https://fonts.gstatic.com; "
      + "img-src 'self' data:; "
      + "connect-src 'self'; "
      + "frame-ancestors 'none'";
    await next();
});

app.UseRateLimiter();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(DevCorsPolicy);
}

app.MapGet("/api/cv", (ICvSource source) => source.Current)
   .RequireRateLimiting(ApiRateLimit)
   .WithName("GetCv")
   .WithOpenApi();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
   .WithName("GetHealth")
   .WithOpenApi();

app.MapFallbackToFile("index.html");

app.Run();
