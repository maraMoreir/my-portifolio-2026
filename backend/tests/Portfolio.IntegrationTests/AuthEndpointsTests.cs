using System.Net;
using System.Net.Http.Json;

namespace Portfolio.IntegrationTests;

public class AuthEndpointsTests : IClassFixture<PortfolioApiFactory>
{
    private readonly PortfolioApiFactory _factory;

    public AuthEndpointsTests(PortfolioApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Login_with_invalid_credentials_returns_401()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new { email = "nobody@example.com", password = "wrong" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Admin_endpoint_without_a_token_returns_401()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/admin/posts");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Admin_endpoint_with_an_authenticated_but_non_admin_token_returns_403()
    {
        var client = await TestAuthHelper.CreateAuthenticatedNonAdminClientAsync(_factory);

        var response = await client.GetAsync("/api/admin/posts");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_endpoint_with_an_admin_token_returns_200()
    {
        var (client, _) = await TestAuthHelper.CreateAuthenticatedAdminClientAsync(_factory);

        var response = await client.GetAsync("/api/admin/posts");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Login_sets_an_httponly_refresh_cookie_and_never_returns_it_in_the_body()
    {
        var client = _factory.CreateClient();
        var email = await TestAuthHelper.SeedAdminUserAsync(_factory);

        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password = TestAuthHelper.PasswordFor(email) });

        Assert.True(response.Headers.TryGetValues("Set-Cookie", out var cookies));
        Assert.Contains(cookies!, c =>
            c.StartsWith("refreshToken=", StringComparison.Ordinal)
            && c.Contains("httponly", StringComparison.OrdinalIgnoreCase));

        var bodyText = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("refreshToken", bodyText, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task A_used_refresh_token_cannot_be_replayed()
    {
        // Cookies aren't auto-managed by HttpClient against TestServer, so
        // the refresh cookie is captured from the login response and
        // attached to requests by hand — this also makes the rotation
        // being tested explicit rather than hidden behind a cookie jar.
        var client = _factory.CreateClient();
        var email = await TestAuthHelper.SeedAdminUserAsync(_factory);

        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new { email, password = TestAuthHelper.PasswordFor(email) });
        var cookieValue = loginResponse.Headers.GetValues("Set-Cookie").First().Split(';')[0];

        var firstRefresh = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        firstRefresh.Headers.Add("Cookie", cookieValue);
        var firstResponse = await client.SendAsync(firstRefresh);
        Assert.Equal(HttpStatusCode.OK, firstResponse.StatusCode);

        // Replaying the same (now-rotated) refresh cookie must fail.
        var secondRefresh = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        secondRefresh.Headers.Add("Cookie", cookieValue);
        var secondResponse = await client.SendAsync(secondRefresh);
        Assert.Equal(HttpStatusCode.Unauthorized, secondResponse.StatusCode);
    }
}
