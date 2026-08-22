using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Middleware;
using Portfolio.Application.Auth;
using Portfolio.Application.Posts;
using Portfolio.Infrastructure;
using Portfolio.Infrastructure.Persistence;
using Portfolio.Infrastructure.Seed;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<PostService>();
builder.Services.AddScoped<AuthService>();

// CORS: only the configured frontend origin(s) may call this API, and only
// they may receive credentials (the refresh-token cookie) — a wildcard
// origin is never allowed together with AllowCredentials.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Independent, coarse defense-in-depth against credential-stuffing on top
// of Identity's own account lockout (see PasswordAuthenticator). Partitioned
// per client IP — a single shared/global bucket would let one noisy client
// exhaust the quota and lock out every other visitor trying to log in.
var loginPermitLimit = builder.Configuration.GetValue("RateLimiting:LoginPermitLimit", 5);
var loginWindowSeconds = builder.Configuration.GetValue("RateLimiting:LoginWindowSeconds", 60);

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("login", context => RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        factory: _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = loginPermitLimit,
            Window = TimeSpan.FromSeconds(loginWindowSeconds),
            QueueLimit = 0,
        }));
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Deployed behind a reverse proxy (Render, Azure App Service, ...) that
// terminates TLS and forwards plain HTTP internally. Without this, every
// request looks like it came from the proxy's own IP over HTTP — which
// would make UseHttpsRedirection redirect-loop, and silently turn the
// per-IP login rate limit (above) into a single shared bucket for every
// visitor. KnownNetworks/KnownProxies are cleared because the platform's
// proxy IP isn't fixed/known in advance and the container has no other
// public ingress path anyway.
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
};
forwardedHeadersOptions.KnownIPNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);

// First in the pipeline so it can catch anything thrown by everything after it.
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    // JSON spec at /openapi/v1.json — import it into Postman/Insomnia or
    // any OpenAPI-aware client for interactive manual testing.
    app.MapOpenApi();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    await next();
});

app.UseCors("Frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Migrations are applied automatically only in Development, for a fast
// inner loop. Production schema changes go through a deliberate deploy
// step (`dotnet ef database update`) instead of running unattended on
// every process start.
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    if (app.Environment.IsDevelopment())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
    }

    await AdminUserSeeder.SeedAsync(app.Services, app.Configuration, logger);
}

app.Run();

// Exposed so WebApplicationFactory<Program> can bootstrap this app in integration tests.
public partial class Program
{
}
