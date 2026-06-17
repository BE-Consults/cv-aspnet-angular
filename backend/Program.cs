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
// =========================================================================

using System.Text.Json.Serialization;
using BScottCv.Data;

var builder = WebApplication.CreateBuilder(args);

const string DevCorsPolicy = "AllowAngularDev";

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<ICvSource, CvSource>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(DevCorsPolicy);
}

app.MapGet("/api/cv", (ICvSource source) => source.Current)
   .WithName("GetCv")
   .WithOpenApi();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
   .WithName("GetHealth")
   .WithOpenApi();

app.MapFallbackToFile("index.html");

app.Run();
