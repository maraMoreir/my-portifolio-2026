using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Portfolio.IntegrationTests;

public class PostsEndpointsTests : IClassFixture<PortfolioApiFactory>
{
    private readonly PortfolioApiFactory _factory;

    public PostsEndpointsTests(PortfolioApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Public_endpoint_never_returns_a_draft_post()
    {
        var (adminClient, _) = await TestAuthHelper.CreateAuthenticatedAdminClientAsync(_factory);
        var (_, slug) = await CreatePostAsync(adminClient, $"Rascunho {Guid.NewGuid():N}");

        var publicClient = _factory.CreateClient();
        var response = await publicClient.GetAsync($"/api/posts/{slug}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Full_lifecycle_create_publish_appears_publicly_then_delete()
    {
        var (adminClient, _) = await TestAuthHelper.CreateAuthenticatedAdminClientAsync(_factory);
        var (id, slug) = await CreatePostAsync(adminClient, $"Post {Guid.NewGuid():N}");

        var publishResponse = await adminClient.PostAsync($"/api/admin/posts/{id}/publish", null);
        publishResponse.EnsureSuccessStatusCode();

        var publicClient = _factory.CreateClient();
        var publicGet = await publicClient.GetAsync($"/api/posts/{slug}");
        Assert.Equal(HttpStatusCode.OK, publicGet.StatusCode);

        var listing = await publicClient.GetFromJsonAsync<JsonElement>("/api/posts");
        Assert.Contains(listing.EnumerateArray(), p => p.GetProperty("slug").GetString() == slug);

        var deleteResponse = await adminClient.DeleteAsync($"/api/admin/posts/{id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var afterDelete = await publicClient.GetAsync($"/api/posts/{slug}");
        Assert.Equal(HttpStatusCode.NotFound, afterDelete.StatusCode);
    }

    [Fact]
    public async Task Unpublishing_a_post_removes_it_from_the_public_listing_again()
    {
        var (adminClient, _) = await TestAuthHelper.CreateAuthenticatedAdminClientAsync(_factory);
        var (id, slug) = await CreatePostAsync(adminClient, $"Post {Guid.NewGuid():N}");
        await adminClient.PostAsync($"/api/admin/posts/{id}/publish", null);

        var unpublishResponse = await adminClient.PostAsync($"/api/admin/posts/{id}/unpublish", null);
        unpublishResponse.EnsureSuccessStatusCode();

        var publicClient = _factory.CreateClient();
        var response = await publicClient.GetAsync($"/api/posts/{slug}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Creating_a_post_with_a_duplicate_title_gets_a_disambiguated_slug()
    {
        var (adminClient, _) = await TestAuthHelper.CreateAuthenticatedAdminClientAsync(_factory);
        var title = $"Duplicado {Guid.NewGuid():N}";

        var (_, firstSlug) = await CreatePostAsync(adminClient, title);
        var (_, secondSlug) = await CreatePostAsync(adminClient, title);

        Assert.NotEqual(firstSlug, secondSlug);
    }

    [Fact]
    public async Task Getting_a_nonexistent_admin_post_returns_404()
    {
        var (adminClient, _) = await TestAuthHelper.CreateAuthenticatedAdminClientAsync(_factory);

        var response = await adminClient.GetAsync($"/api/admin/posts/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Creating_a_post_without_a_title_returns_400()
    {
        var (adminClient, _) = await TestAuthHelper.CreateAuthenticatedAdminClientAsync(_factory);

        var response = await adminClient.PostAsJsonAsync("/api/admin/posts", new
        {
            title = "",
            contentMarkdown = "conteudo",
            excerpt = (string?)null,
            tags = Array.Empty<string>(),
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private static async Task<(Guid Id, string Slug)> CreatePostAsync(HttpClient adminClient, string title)
    {
        var response = await adminClient.PostAsJsonAsync("/api/admin/posts", new
        {
            title,
            contentMarkdown = "Conteúdo de teste com algumas palavras.",
            excerpt = "Resumo de teste",
            tags = new[] { "Teste" },
        });
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        return (body.GetProperty("id").GetGuid(), body.GetProperty("slug").GetString()!);
    }
}
