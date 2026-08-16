using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Infrastructure.Identity;

namespace Portfolio.IntegrationTests;

internal static class TestAuthHelper
{
    private const string Password = "Sup3r-Secret-Passw0rd!";

    public static async Task<(HttpClient Client, string Email)> CreateAuthenticatedAdminClientAsync(PortfolioApiFactory factory)
    {
        var email = await SeedUserAsync(factory, "Admin");
        var client = await LoginAsync(factory, email);
        return (client, email);
    }

    public static async Task<HttpClient> CreateAuthenticatedNonAdminClientAsync(PortfolioApiFactory factory)
    {
        var email = await SeedUserAsync(factory, role: null);
        return await LoginAsync(factory, email);
    }

    public static Task<string> SeedAdminUserAsync(PortfolioApiFactory factory) => SeedUserAsync(factory, "Admin");

    public static string PasswordFor(string email) => Password;

    private static async Task<HttpClient> LoginAsync(PortfolioApiFactory factory, string email)
    {
        var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password = Password });
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var token = body.GetProperty("accessToken").GetString();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    private static async Task<string> SeedUserAsync(PortfolioApiFactory factory, string? role)
    {
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        var email = $"{Guid.NewGuid():N}@example.com";
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            Name = "Test User",
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(user, Password);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(string.Join("; ", result.Errors.Select(e => e.Description)));
        }

        if (role is not null)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }

            await userManager.AddToRoleAsync(user, role);
        }

        return email;
    }
}
