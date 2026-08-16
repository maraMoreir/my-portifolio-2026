using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Api.Contracts.Auth;
using Portfolio.Application.Auth;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string RefreshTokenCookieName = "refreshToken";

    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Issues a short-lived access token (returned in the body, kept in
    /// memory by the frontend) and a refresh token (set as an HttpOnly
    /// cookie, never exposed to JavaScript). Rate-limited per IP to slow
    /// down credential-stuffing/brute-force attempts.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request.Email, request.Password, ct);
        SetRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAt);
        return Ok(ToResponse(result));
    }

    /// <summary>
    /// Silently renews the session using the HttpOnly refresh cookie. The
    /// old refresh token is revoked as part of this call (rotation), so it
    /// can't be replayed even if it leaked.
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Refresh(CancellationToken ct)
    {
        if (!Request.Cookies.TryGetValue(RefreshTokenCookieName, out var rawToken) || string.IsNullOrEmpty(rawToken))
        {
            return Unauthorized();
        }

        var result = await _authService.RefreshAsync(rawToken, ct);
        SetRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAt);
        return Ok(ToResponse(result));
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        if (Request.Cookies.TryGetValue(RefreshTokenCookieName, out var rawToken) && !string.IsNullOrEmpty(rawToken))
        {
            await _authService.LogoutAsync(rawToken, ct);
        }

        Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions { Path = "/api/auth" });
        return NoContent();
    }

    private void SetRefreshTokenCookie(string rawToken, DateTime expiresAt)
    {
        // HttpOnly: never readable by JavaScript, so an XSS bug can't steal
        // it. Secure + SameSite=None: works whether the frontend ends up on
        // the same site (subdomain) or a fully different origin, but always
        // requires HTTPS — see backend/README.md for the local dev cert.
        // Path scoped to /api/auth: the browser never sends this cookie to
        // any other endpoint, so it can't be leveraged as a CSRF vector
        // against unrelated routes.
        Response.Cookies.Append(RefreshTokenCookieName, rawToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = expiresAt,
            Path = "/api/auth",
        });
    }

    private static LoginResponse ToResponse(LoginResult result) => new(
        result.AccessToken,
        result.AccessTokenExpiresAt,
        new UserResponse(result.User.Id, result.User.Email, result.User.Name, result.User.Roles));
}
