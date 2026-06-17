# syntax=docker/dockerfile:1.7

# =========================================================================
# Multi-stage build for the single-service deployable.
#
# Stage 1 builds the Angular bundle on a Node image.
# Stage 2 publishes the ASP.NET Core app on the .NET SDK image, copying
#   the Angular bundle into wwwroot/ before publishing so the bundle
#   ships inside the .NET output directory.
# Stage 3 is the lean runtime image — just the published bundle + the
#   ASP.NET Core runtime, ~200 MB.
#
# Each stage layer is cache-friendly: lock files copied before sources
# so dependency restores re-use the layer when only source changes.
# =========================================================================

# ---------- 1. Angular bundle ----------
FROM node:24-alpine AS frontend
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm exec ng build

# ---------- 2. .NET publish, with the Angular bundle copied into wwwroot ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend
WORKDIR /src
COPY backend/backend.csproj ./
RUN dotnet restore
COPY backend/ ./
COPY --from=frontend /app/dist/frontend/browser ./wwwroot
RUN dotnet publish -c Release -o /publish /p:UseAppHost=false

# ---------- 3. Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=backend /publish ./
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["dotnet", "BScottCv.Api.dll"]
