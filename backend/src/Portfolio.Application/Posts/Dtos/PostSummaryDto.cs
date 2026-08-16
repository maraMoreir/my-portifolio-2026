namespace Portfolio.Application.Posts.Dtos;

/// <summary>Shape consumed by the public listing and the admin table — mirrors the frontend's `PostMetadata` (entities/post/types.ts), no content body.</summary>
public sealed record PostSummaryDto(
    Guid Id,
    string Title,
    string Slug,
    string? Excerpt,
    IReadOnlyList<string> Tags,
    int ReadingTimeMinutes,
    string Status,
    DateTime? PublishedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt);
