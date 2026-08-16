namespace Portfolio.Domain.Auth;

/// <summary>
/// A single refresh-token session. Only the SHA-256 hash is ever persisted —
/// the raw token exists only in the HttpOnly cookie on the client and in
/// memory for the duration of the request that issues/rotates it, so a
/// database leak alone can never be used to impersonate a session.
/// </summary>
public class RefreshToken
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string TokenHash { get; private set; } = string.Empty;
    public DateTime ExpiresAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? RevokedAt { get; private set; }

    public bool IsActive => RevokedAt is null && DateTime.UtcNow < ExpiresAt;

    private RefreshToken()
    {
        // EF Core materialization.
    }

    public RefreshToken(Guid userId, string tokenHash, DateTime expiresAt)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        TokenHash = tokenHash;
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
    }

    /// <summary>Revokes the token. Used both on logout and on rotation (the old token becomes unusable as soon as a new one is issued).</summary>
    public void Revoke() => RevokedAt = DateTime.UtcNow;
}
