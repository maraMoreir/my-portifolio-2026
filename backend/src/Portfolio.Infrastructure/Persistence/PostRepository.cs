using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Posts;
using Portfolio.Domain.Posts;
using Portfolio.Domain.Tags;

namespace Portfolio.Infrastructure.Persistence;

public class PostRepository : IPostRepository
{
    private readonly AppDbContext _db;

    public PostRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Post>> GetPublishedAsync(CancellationToken ct = default) =>
        await _db.Posts
            .Include(p => p.Tags)
            .Where(p => p.Status == PostStatus.Published)
            .OrderByDescending(p => p.PublishedAt)
            .ToListAsync(ct);

    public async Task<Post?> GetPublishedBySlugAsync(string slug, CancellationToken ct = default) =>
        await _db.Posts
            .Include(p => p.Tags)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.Status == PostStatus.Published, ct);

    public async Task<IReadOnlyList<string>> GetPublishedTagNamesAsync(CancellationToken ct = default) =>
        await _db.Posts
            .Where(p => p.Status == PostStatus.Published)
            .SelectMany(p => p.Tags)
            .Select(t => t.Name)
            .Distinct()
            .OrderBy(name => name)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Post>> GetAllAsync(CancellationToken ct = default) =>
        await _db.Posts
            .Include(p => p.Tags)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);

    public async Task<Post?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Posts.Include(p => p.Tags).FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludingId = null, CancellationToken ct = default) =>
        await _db.Posts.AnyAsync(p => p.Slug == slug && (excludingId == null || p.Id != excludingId), ct);

    public async Task AddAsync(Post post, CancellationToken ct = default) =>
        await _db.Posts.AddAsync(post, ct);

    public void Remove(Post post) => _db.Posts.Remove(post);

    public async Task<IReadOnlyList<Tag>> GetOrCreateTagsAsync(IEnumerable<string> tagNames, CancellationToken ct = default)
    {
        var normalizedNames = tagNames
            .Select(name => name.Trim())
            .Where(name => name.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (normalizedNames.Count == 0)
        {
            return [];
        }

        var existing = await _db.Tags
            .Where(t => normalizedNames.Contains(t.Name))
            .ToListAsync(ct);

        var missingNames = normalizedNames
            .Where(name => !existing.Any(t => string.Equals(t.Name, name, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        var created = missingNames.Select(name => new Tag(name)).ToList();
        if (created.Count > 0)
        {
            await _db.Tags.AddRangeAsync(created, ct);
        }

        return existing.Concat(created).ToList();
    }

    public Task SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
}
