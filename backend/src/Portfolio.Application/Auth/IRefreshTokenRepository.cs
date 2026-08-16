using Portfolio.Domain.Auth;

namespace Portfolio.Application.Auth;

public interface IRefreshTokenRepository
{
    Task AddAsync(RefreshToken token, CancellationToken ct = default);

    /// <summary>Returns the token only if it exists and is currently active (not revoked, not expired).</summary>
    Task<RefreshToken?> GetActiveByHashAsync(string tokenHash, CancellationToken ct = default);

    Task SaveChangesAsync(CancellationToken ct = default);
}
