namespace Portfolio.Application.Posts.Dtos;

/// <summary>Full post shape, including content — mirrors the frontend's `Post` (entities/post/types.ts).</summary>
public sealed record PostDto(
    Guid Id,
    string Title,
    string Slug,
    string? Excerpt,
    string ContentMarkdown,
    IReadOnlyList<string> Tags,
    int ReadingTimeMinutes,
    string Status,
    DateTime? PublishedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt);
