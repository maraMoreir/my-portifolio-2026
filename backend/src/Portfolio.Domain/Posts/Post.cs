using Portfolio.Domain.Tags;

namespace Portfolio.Domain.Posts;

/// <summary>
/// A blog post. Mutation happens only through the methods below so invalid
/// states (e.g. publishing without a title) can't be constructed, even
/// though this stays a plain entity rather than a full DDD aggregate —
/// there is no need for more ceremony than that at this scale.
/// </summary>
public class Post
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Excerpt { get; private set; }
    public string ContentMarkdown { get; private set; } = string.Empty;
    public PostStatus Status { get; private set; } = PostStatus.Draft;
    public DateTime? PublishedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    /// <summary>Id of the authenticated user who created the post. Single admin today; kept as a plain FK so multiple authors can be added later without a schema change.</summary>
    public Guid AuthorId { get; private set; }

    public ICollection<Tag> Tags { get; private set; } = new List<Tag>();

    private Post()
    {
        // EF Core materialization.
    }

    public Post(string title, string slug, string contentMarkdown, string? excerpt, Guid authorId)
    {
        SetTitle(title);
        SetSlug(slug);
        ContentMarkdown = contentMarkdown ?? string.Empty;
        Excerpt = excerpt;
        AuthorId = authorId;

        Id = Guid.NewGuid();
        Status = PostStatus.Draft;
        var now = DateTime.UtcNow;
        CreatedAt = now;
        UpdatedAt = now;
    }

    public void UpdateContent(string title, string slug, string contentMarkdown, string? excerpt)
    {
        SetTitle(title);
        SetSlug(slug);
        ContentMarkdown = contentMarkdown ?? string.Empty;
        Excerpt = excerpt;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetTags(IEnumerable<Tag> tags)
    {
        Tags = tags.ToList();
        UpdatedAt = DateTime.UtcNow;
    }

    public void Publish()
    {
        if (string.IsNullOrWhiteSpace(Title) || string.IsNullOrWhiteSpace(Slug))
        {
            throw new InvalidOperationException("Não é possível publicar um post sem título e slug.");
        }

        Status = PostStatus.Published;
        PublishedAt ??= DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Unpublish()
    {
        Status = PostStatus.Draft;
        UpdatedAt = DateTime.UtcNow;
        // PublishedAt is intentionally kept: republishing shouldn't lose the
        // original publication date, only Status changes.
    }

    private void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("O título é obrigatório.", nameof(title));
        }

        if (title.Length > 200)
        {
            throw new ArgumentException("O título deve ter no máximo 200 caracteres.", nameof(title));
        }

        Title = title.Trim();
    }

    private void SetSlug(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            throw new ArgumentException("O slug é obrigatório.", nameof(slug));
        }

        Slug = slug.Trim().ToLowerInvariant();
    }
}
