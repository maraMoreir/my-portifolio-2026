namespace Portfolio.Application.Auth;

public sealed record LoginResult(
    string AccessToken,
    DateTime AccessTokenExpiresAt,
    string RefreshToken,
    DateTime RefreshTokenExpiresAt,
    AuthenticatedUser User);
