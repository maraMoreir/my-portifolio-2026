namespace Portfolio.Api.Contracts.Auth;

/// <summary>
/// Only the access token goes in the response body — the frontend keeps it
/// in memory only (never localStorage). The refresh token never appears
/// here at all; it travels exclusively as an HttpOnly cookie set directly
/// on the response.
/// </summary>
public sealed record LoginResponse(string AccessToken, DateTime AccessTokenExpiresAt, UserResponse User);

public sealed record UserResponse(Guid Id, string Email, string Name, IReadOnlyList<string> Roles);
