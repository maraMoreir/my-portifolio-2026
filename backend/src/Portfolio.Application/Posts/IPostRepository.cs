using Portfolio.Domain.Posts;
using Portfolio.Domain.Tags;

namespace Portfolio.Application.Posts;

/// <summary>
/// Port the Application layer depends on; implemented in Infrastructure with
/// EF Core. Keeps PostService free of any persistence-technology detail.
/// </summary>
public interface IPostRepository
{
    Task<IReadOnlyList<Post>> GetPublishedAsync(CancellationToken ct = default);

    Task<Post?> GetPublishedBySlugAsync(string slug, CancellationToken ct = default);

    Task<IReadOnlyList<string>> GetPublishedTagNamesAsync(CancellationToken ct = default);

    Task<IReadOnlyList<Post>> GetAllAsync(CancellationToken ct = default);

    Task<Post?> GetByIdAsync(Guid id, CancellationToken ct = default);

    Task<bool> SlugExistsAsync(string slug, Guid? excludingId = null, CancellationToken ct = default);

    Task AddAsync(Post post, CancellationToken ct = default);

    void Remove(Post post);

    /// <summary>Resolves tag names to existing <see cref="Tag"/> entities, creating any that don't exist yet (case-insensitive match).</summary>
    Task<IReadOnlyList<Tag>> GetOrCreateTagsAsync(IEnumerable<string> tagNames, CancellationToken ct = default);

    Task SaveChangesAsync(CancellationToken ct = default);
}
