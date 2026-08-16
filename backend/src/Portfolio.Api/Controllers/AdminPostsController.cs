using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Posts;
using Portfolio.Application.Posts.Dtos;

namespace Portfolio.Api.Controllers;

/// <summary>
/// Admin-only CRUD for posts, including drafts. Authorization is enforced
/// here on the server via the "AdminOnly" policy — the frontend route guard
/// is UX only, this is where access is actually decided. Unauthenticated
/// requests get 401, authenticated-but-non-admin requests get 403
/// (ASP.NET Core's default behavior for [Authorize(Policy=...)]).
/// </summary>
[ApiController]
[Route("api/admin/posts")]
[Authorize(Policy = "AdminOnly")]
public class AdminPostsController : ControllerBase
{
    private readonly PostService _postService;

    public AdminPostsController(PostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PostSummaryDto>>> GetAll(CancellationToken ct) =>
        Ok(await _postService.GetAllPostsForAdminAsync(ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PostDto>> GetById(Guid id, CancellationToken ct) =>
        Ok(await _postService.GetPostForAdminAsync(id, ct));

    [HttpPost]
    public async Task<ActionResult<PostDto>> Create(CreatePostRequest request, CancellationToken ct)
    {
        var post = await _postService.CreateAsync(request, GetUserId(), ct);
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PostDto>> Update(Guid id, UpdatePostRequest request, CancellationToken ct) =>
        Ok(await _postService.UpdateAsync(id, request, ct));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _postService.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<ActionResult<PostDto>> Publish(Guid id, CancellationToken ct) =>
        Ok(await _postService.PublishAsync(id, ct));

    [HttpPost("{id:guid}/unpublish")]
    public async Task<ActionResult<PostDto>> Unpublish(Guid id, CancellationToken ct) =>
        Ok(await _postService.UnpublishAsync(id, ct));

    private Guid GetUserId()
    {
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(sub!);
    }
}
