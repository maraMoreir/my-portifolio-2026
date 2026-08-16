using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.IntegrationTests;

/// <summary>
/// Boots the real Program.cs pipeline (controllers, auth, middleware, CORS,
/// rate limiting) against an in-memory SQLite database instead of SQL
/// Server, so integration tests exercise actual HTTP + EF Core behavior
/// without needing a real database server. Config that Program.cs reads
/// eagerly (connection string, JWT signing key) is supplied via environment
/// variables set before the host builds, since WebApplicationFactory's own
/// ConfigureAppConfiguration hook runs too late for that.
/// </summary>
public class PortfolioApiFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    public PortfolioApiFactory()
    {
        _connection.Open();

        Environment.SetEnvironmentVariable("ConnectionStrings__Default", "Data Source=unused-overridden-in-tests");
        Environment.SetEnvironmentVariable("Jwt__Issuer", "PortfolioApi.Tests");
        Environment.SetEnvironmentVariable("Jwt__Audience", "PortfolioApi.Tests");
        Environment.SetEnvironmentVariable("Jwt__SigningKey", "integration-tests-signing-key-at-least-32-chars-long");
        Environment.SetEnvironmentVariable("Jwt__AccessTokenMinutes", "15");
        Environment.SetEnvironmentVariable("Jwt__RefreshTokenDays", "14");
        Environment.SetEnvironmentVariable("Cors__AllowedOrigins__0", "http://localhost:5173");
        // The real login rate limit is deliberately strict (see Program.cs);
        // tests log in many times against the same loopback IP partition,
        // so it's relaxed here rather than testing around production limits.
        Environment.SetEnvironmentVariable("RateLimiting__LoginPermitLimit", "1000");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // AddDbContext composes its provider configuration additively via
            // IDbContextOptionsConfiguration<T> — Program.cs already added a
            // SqlServer one. Removing only DbContextOptions<AppDbContext>
            // leaves that behind, and EF then sees two providers configured
            // on the same context and throws. Both must go before Sqlite is
            // registered fresh.
            var toRemove = services
                .Where(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>)
                    || (d.ServiceType.IsGenericType
                        && d.ServiceType.GetGenericTypeDefinition() == typeof(IDbContextOptionsConfiguration<>)
                        && d.ServiceType.GenericTypeArguments[0] == typeof(AppDbContext)))
                .ToList();

            foreach (var descriptor in toRemove)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<AppDbContext>(options => options.UseSqlite(_connection));

            using var provider = services.BuildServiceProvider();
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
        {
            _connection.Dispose();
        }
    }
}
