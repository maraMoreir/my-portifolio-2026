using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Portfolio.Infrastructure.Identity;

namespace Portfolio.Infrastructure.Seed;

/// <summary>
/// Creates the single admin user on first run, from configuration — never
/// from a hardcoded value. Intentionally does nothing (with a clear log
/// warning) if AdminUser:Email/Password aren't configured, and does
/// nothing once any Admin already exists, so it's safe to call on every
/// startup.
/// </summary>
public static class AdminUserSeeder
{
    public const string AdminRole = "Admin";

    public static async Task SeedAsync(IServiceProvider rootServices, IConfiguration configuration, ILogger logger)
    {
        using var scope = rootServices.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        if (!await roleManager.RoleExistsAsync(AdminRole))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(AdminRole));
        }

        var adminAlreadyExists = (await userManager.GetUsersInRoleAsync(AdminRole)).Count > 0;
        if (adminAlreadyExists)
        {
            return;
        }

        var email = configuration["AdminUser:Email"];
        var password = configuration["AdminUser:Password"];
        var name = configuration["AdminUser:Name"] ?? "Admin";

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning(
                "Nenhum usuario administrador existe e AdminUser:Email/AdminUser:Password nao " +
                "foram configurados. Configure-os via 'dotnet user-secrets' (dev) ou variaveis de " +
                "ambiente AdminUser__Email/AdminUser__Password (prod) e reinicie a API.");
            return;
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            Name = name,
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            logger.LogError(
                "Falha ao criar o usuario administrador inicial: {Errors}",
                string.Join("; ", result.Errors.Select(e => e.Description)));
            return;
        }

        await userManager.AddToRoleAsync(user, AdminRole);
        logger.LogInformation("Usuario administrador inicial criado para {Email}.", email);
    }
}
