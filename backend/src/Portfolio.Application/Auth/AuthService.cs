using Portfolio.Domain.Auth;

namespace Portfolio.Application.Auth;

/// <summary>
/// Login/refresh/logout use cases. Access tokens are short-lived and meant
/// to live only in the frontend's memory (never localStorage); refresh
/// tokens are rotated on every use and stored only as a hash, delivered to
/// the client exclusively via an HttpOnly cookie set by the controller.
/// </summary>
public class AuthService
{
    private readonly IPasswordAuthenticator _passwordAuthenticator;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokens;

    public AuthService(
        IPasswordAuthenticator passwordAuthenticator,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokens)
    {
        _passwordAuthenticator = passwordAuthenticator;
        _tokenService = tokenService;
        _refreshTokens = refreshTokens;
    }

    public async Task<LoginResult> LoginAsync(string email, string password, CancellationToken ct = default)
    {
        var user = await _passwordAuthenticator.ValidateCredentialsAsync(email, password, ct)
            ?? throw new UnauthorizedAccessException("Credenciais inválidas.");

        return await IssueTokensAsync(user, ct);
    }

    public async Task<LoginResult> RefreshAsync(string rawRefreshToken, CancellationToken ct = default)
    {
        var hash = _tokenService.HashToken(rawRefreshToken);
        var existing = await _refreshTokens.GetActiveByHashAsync(hash, ct)
            ?? throw new UnauthorizedAccessException("Sessão expirada. Faça login novamente.");

        // Rotation: the token just used becomes invalid immediately, so a
        // stolen-and-replayed refresh cookie can be used at most once.
        existing.Revoke();
        await _refreshTokens.SaveChangesAsync(ct);

        var user = await _passwordAuthenticator.GetByIdAsync(existing.UserId, ct)
            ?? throw new UnauthorizedAccessException("Usuário não encontrado.");

        return await IssueTokensAsync(user, ct);
    }

    public async Task LogoutAsync(string rawRefreshToken, CancellationToken ct = default)
    {
        var hash = _tokenService.HashToken(rawRefreshToken);
        var existing = await _refreshTokens.GetActiveByHashAsync(hash, ct);
        if (existing is null)
        {
            return;
        }

        existing.Revoke();
        await _refreshTokens.SaveChangesAsync(ct);
    }

    private async Task<LoginResult> IssueTokensAsync(AuthenticatedUser user, CancellationToken ct)
    {
        var (accessToken, accessExpiresAt) = _tokenService.GenerateAccessToken(user);
        var (rawRefreshToken, refreshHash, refreshExpiresAt) = _tokenService.GenerateRefreshToken();

        var refreshEntity = new RefreshToken(user.Id, refreshHash, refreshExpiresAt);
        await _refreshTokens.AddAsync(refreshEntity, ct);
        await _refreshTokens.SaveChangesAsync(ct);

        return new LoginResult(accessToken, accessExpiresAt, rawRefreshToken, refreshExpiresAt, user);
    }
}
