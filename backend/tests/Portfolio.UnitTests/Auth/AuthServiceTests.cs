using Moq;
using Portfolio.Application.Auth;
using Portfolio.Domain.Auth;

namespace Portfolio.UnitTests.Auth;

public class AuthServiceTests
{
    private readonly Mock<IPasswordAuthenticator> _passwordAuthenticator = new();
    private readonly Mock<ITokenService> _tokenService = new();
    private readonly Mock<IRefreshTokenRepository> _refreshTokens = new();
    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        _sut = new AuthService(_passwordAuthenticator.Object, _tokenService.Object, _refreshTokens.Object);
    }

    private static AuthenticatedUser SampleUser() =>
        new(Guid.NewGuid(), "admin@example.com", "Admin", ["Admin"]);

    [Fact]
    public async Task LoginAsync_throws_unauthorized_when_credentials_are_invalid()
    {
        _passwordAuthenticator
            .Setup(a => a.ValidateCredentialsAsync("admin@example.com", "wrong", default))
            .ReturnsAsync((AuthenticatedUser?)null);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _sut.LoginAsync("admin@example.com", "wrong", default));
    }

    [Fact]
    public async Task LoginAsync_issues_an_access_and_refresh_token_on_success()
    {
        var user = SampleUser();
        _passwordAuthenticator
            .Setup(a => a.ValidateCredentialsAsync(user.Email, "correct", default))
            .ReturnsAsync(user);
        _tokenService
            .Setup(t => t.GenerateAccessToken(user))
            .Returns(("access-token", DateTime.UtcNow.AddMinutes(15)));
        _tokenService
            .Setup(t => t.GenerateRefreshToken())
            .Returns(("raw-refresh", "hashed-refresh", DateTime.UtcNow.AddDays(14)));

        var result = await _sut.LoginAsync(user.Email, "correct", default);

        Assert.Equal("access-token", result.AccessToken);
        Assert.Equal("raw-refresh", result.RefreshToken);
        _refreshTokens.Verify(r => r.AddAsync(It.IsAny<RefreshToken>(), default), Times.Once);
    }

    [Fact]
    public async Task RefreshAsync_throws_unauthorized_when_token_is_not_active()
    {
        _tokenService.Setup(t => t.HashToken("stale")).Returns("stale-hash");
        _refreshTokens
            .Setup(r => r.GetActiveByHashAsync("stale-hash", default))
            .ReturnsAsync((RefreshToken?)null);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _sut.RefreshAsync("stale", default));
    }

    [Fact]
    public async Task RefreshAsync_revokes_the_old_token_and_issues_a_new_pair()
    {
        var user = SampleUser();
        var existingToken = new RefreshToken(user.Id, "old-hash", DateTime.UtcNow.AddDays(1));

        _tokenService.Setup(t => t.HashToken("raw")).Returns("old-hash");
        _refreshTokens.Setup(r => r.GetActiveByHashAsync("old-hash", default)).ReturnsAsync(existingToken);
        _passwordAuthenticator.Setup(a => a.GetByIdAsync(user.Id, default)).ReturnsAsync(user);
        _tokenService.Setup(t => t.GenerateAccessToken(user)).Returns(("new-access", DateTime.UtcNow.AddMinutes(15)));
        _tokenService.Setup(t => t.GenerateRefreshToken()).Returns(("new-raw", "new-hash", DateTime.UtcNow.AddDays(14)));

        var result = await _sut.RefreshAsync("raw", default);

        Assert.False(existingToken.IsActive);
        Assert.Equal("new-access", result.AccessToken);
    }
}
