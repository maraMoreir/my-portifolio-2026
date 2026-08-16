using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Posts.Dtos;
using Portfolio.Domain.Posts;

namespace Portfolio.Application.Posts;

/// <summary>
/// Use cases for the blog. Talks only to <see cref="IPostRepository"/>, never
/// to EF Core directly — this is the seam that lets the frontend swap the
/// mock `blogService` for real HTTP calls without this layer changing.
/// </summary>
public class PostService
{
    private readonly IPostRepository _repository;

    public PostService(IPostRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<PostSummaryDto>> GetPublishedPostsAsync(CancellationToken ct = default)
    {
        var posts = await _repository.GetPublishedAsync(ct);
        return posts.Select(ToSummaryDto).ToList();
    }

    public async Task<PostDto?> GetPublishedPostBySlugAsync(string slug, CancellationToken ct = default)
    {
        var post = await _repository.GetPublishedBySlugAsync(slug, ct);
        return post is null ? null : ToDto(post);
    }

    public Task<IReadOnlyList<string>> GetPublishedTagsAsync(CancellationToken ct = default) =>
        _repository.GetPublishedTagNamesAsync(ct);

    public async Task<IReadOnlyList<PostSummaryDto>> GetAllPostsForAdminAsync(CancellationToken ct = default)
    {
        var posts = await _repository.GetAllAsync(ct);
        return posts.Select(ToSummaryDto).ToList();
    }

    public async Task<PostDto> GetPostForAdminAsync(Guid id, CancellationToken ct = default)
    {
        var post = await GetOrThrowAsync(id, ct);
        return ToDto(post);
    }

    public async Task<PostDto> CreateAsync(CreatePostRequest request, Guid authorId, CancellationToken ct = default)
    {
        var slug = await GenerateUniqueSlugAsync(request.Title, excludingId: null, ct);
        var post = new Post(request.Title, slug, request.ContentMarkdown, request.Excerpt, authorId);

        var tags = await _repository.GetOrCreateTagsAsync(request.Tags ?? [], ct);
        post.SetTags(tags);

        await _repository.AddAsync(post, ct);
        await _repository.SaveChangesAsync(ct);
        return ToDto(post);
    }

    public async Task<PostDto> UpdateAsync(Guid id, UpdatePostRequest request, CancellationToken ct = default)
    {
        var post = await GetOrThrowAsync(id, ct);

        var slug = SlugGenerator.Generate(request.Title);
        if (!string.Equals(slug, post.Slug, StringComparison.Ordinal)
            && await _repository.SlugExistsAsync(slug, id, ct))
        {
            throw new ConflictException($"Já existe um post com o slug '{slug}'.");
        }

        post.UpdateContent(request.Title, slug, request.ContentMarkdown, request.Excerpt);

        var tags = await _repository.GetOrCreateTagsAsync(request.Tags ?? [], ct);
        post.SetTags(tags);

        await _repository.SaveChangesAsync(ct);
        return ToDto(post);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var post = await GetOrThrowAsync(id, ct);
        _repository.Remove(post);
        await _repository.SaveChangesAsync(ct);
    }

    public async Task<PostDto> PublishAsync(Guid id, CancellationToken ct = default)
    {
        var post = await GetOrThrowAsync(id, ct);
        post.Publish();
        await _repository.SaveChangesAsync(ct);
        return ToDto(post);
    }

    public async Task<PostDto> UnpublishAsync(Guid id, CancellationToken ct = default)
    {
        var post = await GetOrThrowAsync(id, ct);
        post.Unpublish();
        await _repository.SaveChangesAsync(ct);
        return ToDto(post);
    }

    private async Task<Post> GetOrThrowAsync(Guid id, CancellationToken ct)
    {
        return await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"Post '{id}' não encontrado.");
    }

    private async Task<string> GenerateUniqueSlugAsync(string title, Guid? excludingId, CancellationToken ct)
    {
        var baseSlug = SlugGenerator.Generate(title);
        var slug = baseSlug;
        var suffix = 2;

        while (await _repository.SlugExistsAsync(slug, excludingId, ct))
        {
            slug = $"{baseSlug}-{suffix}";
            suffix++;
        }

        return slug;
    }

    private static PostSummaryDto ToSummaryDto(Post post) => new(
        post.Id,
        post.Title,
        post.Slug,
        post.Excerpt,
        post.Tags.Select(t => t.Name).OrderBy(name => name, StringComparer.OrdinalIgnoreCase).ToList(),
        ReadingTimeCalculator.Calculate(post.ContentMarkdown),
        post.Status.ToString(),
        post.PublishedAt,
        post.CreatedAt,
        post.UpdatedAt);

    private static PostDto ToDto(Post post) => new(
        post.Id,
        post.Title,
        post.Slug,
        post.Excerpt,
        post.ContentMarkdown,
        post.Tags.Select(t => t.Name).OrderBy(name => name, StringComparer.OrdinalIgnoreCase).ToList(),
        ReadingTimeCalculator.Calculate(post.ContentMarkdown),
        post.Status.ToString(),
        post.PublishedAt,
        post.CreatedAt,
        post.UpdatedAt);
}
