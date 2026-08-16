using Portfolio.Domain.Posts;
using Portfolio.Domain.Tags;

namespace Portfolio.UnitTests.Domain;

public class PostTests
{
    private static Post CreatePost() =>
        new("Título de Teste", "titulo-de-teste", "Conteúdo", "Resumo", Guid.NewGuid());

    [Fact]
    public void Constructor_starts_as_draft_with_no_published_date()
    {
        var post = CreatePost();

        Assert.Equal(PostStatus.Draft, post.Status);
        Assert.Null(post.PublishedAt);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_throws_when_title_is_blank(string title)
    {
        Assert.Throws<ArgumentException>(() => new Post(title, "slug", "conteudo", null, Guid.NewGuid()));
    }

    [Fact]
    public void Publish_sets_status_and_publishedAt()
    {
        var post = CreatePost();

        post.Publish();

        Assert.Equal(PostStatus.Published, post.Status);
        Assert.NotNull(post.PublishedAt);
    }

    [Fact]
    public void Publish_twice_does_not_change_the_original_publishedAt()
    {
        var post = CreatePost();
        post.Publish();
        var firstPublishedAt = post.PublishedAt;

        post.Unpublish();
        post.Publish();

        Assert.Equal(firstPublishedAt, post.PublishedAt);
    }

    [Fact]
    public void Unpublish_reverts_to_draft_but_keeps_publishedAt()
    {
        var post = CreatePost();
        post.Publish();

        post.Unpublish();

        Assert.Equal(PostStatus.Draft, post.Status);
        Assert.NotNull(post.PublishedAt);
    }

    [Fact]
    public void SetTags_replaces_the_full_tag_collection()
    {
        var post = CreatePost();
        var tag = new Tag("Backend");

        post.SetTags([tag]);

        Assert.Single(post.Tags);
        Assert.Equal("Backend", post.Tags.First().Name);
    }

    [Fact]
    public void UpdateContent_normalizes_slug_to_lowercase()
    {
        var post = CreatePost();

        post.UpdateContent("Novo Título", "NOVO-SLUG", "novo conteudo", null);

        Assert.Equal("novo-slug", post.Slug);
    }
}
