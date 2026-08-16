namespace Portfolio.Application.Auth;

public interface ITokenService
{
    /// <summary>Signed, short-lived JWT carrying sub/email/name/role claims.</summary>
    (string Token, DateTime ExpiresAt) GenerateAccessToken(AuthenticatedUser user);

    /// <summary>High-entropy opaque token. Only its hash is meant to be persisted — the raw value is returned once, for the HttpOnly cookie.</summary>
    (string RawToken, string TokenHash, DateTime ExpiresAt) GenerateRefreshToken();

    string HashToken(string rawToken);
}
