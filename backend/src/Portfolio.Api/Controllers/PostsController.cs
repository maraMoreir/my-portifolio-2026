using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Posts;
using Portfolio.Application.Posts.Dtos;

namespace Portfolio.Api.Controllers;

/// <summary>Public, unauthenticated endpoints — only ever returns Published posts.</summary>
[ApiController]
[Route("api/posts")]
[AllowAnonymous]
public class PostsController : ControllerBase
{
    private readonly PostService _postService;

    public PostsController(PostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PostSummaryDto>>> GetPublished(CancellationToken ct) =>
        Ok(await _postService.GetPublishedPostsAsync(ct));

    [HttpGet("tags")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTags(CancellationToken ct) =>
        Ok(await _postService.GetPublishedTagsAsync(ct));

    [HttpGet("{slug}")]
    public async Task<ActionResult<PostDto>> GetBySlug(string slug, CancellationToken ct)
    {
        var post = await _postService.GetPublishedPostBySlugAsync(slug, ct);
        return post is null ? NotFound() : Ok(post);
    }
}
