# syntax=docker/dockerfile:1

# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy only project files first so dependency restore is cached across
# builds unless a .csproj actually changes.
COPY Portfolio.slnx ./
COPY src/Portfolio.Domain/*.csproj src/Portfolio.Domain/
COPY src/Portfolio.Application/*.csproj src/Portfolio.Application/
COPY src/Portfolio.Infrastructure/*.csproj src/Portfolio.Infrastructure/
COPY src/Portfolio.Api/*.csproj src/Portfolio.Api/
RUN dotnet restore src/Portfolio.Api/Portfolio.Api.csproj

COPY src/ src/
RUN dotnet publish src/Portfolio.Api/Portfolio.Api.csproj -c Release -o /app --no-restore

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_ENVIRONMENT=Production

# Shell form (not exec form) so $PORT — injected by Render at container
# start, not known at build time — actually gets expanded.
ENTRYPOINT ["/bin/sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} exec dotnet Portfolio.Api.dll"]
