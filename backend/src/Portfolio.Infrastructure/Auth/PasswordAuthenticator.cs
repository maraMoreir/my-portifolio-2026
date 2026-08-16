using Microsoft.AspNetCore.Identity;
using Portfolio.Application.Auth;
using Portfolio.Infrastructure.Identity;

namespace Portfolio.Infrastructure.Auth;

public class PasswordAuthenticator : IPasswordAuthenticator
{
    private readonly UserManager<ApplicationUser> _userManager;

    public PasswordAuthenticator(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password, CancellationToken ct = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            return null;
        }

        // Identity's own lockout counter is the brute-force defense at the
        // account level; the login endpoint is also rate-limited per IP
        // (see Program.cs) as a second, independent layer.
        if (await _userManager.IsLockedOutAsync(user))
        {
            return null;
        }

        if (!await _userManager.CheckPasswordAsync(user, password))
        {
            await _userManager.AccessFailedAsync(user);
            return null;
        }

        await _userManager.ResetAccessFailedCountAsync(user);
        return await ToAuthenticatedUserAsync(user);
    }

    public async Task<AuthenticatedUser?> GetByIdAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        return user is null ? null : await ToAuthenticatedUserAsync(user);
    }

    private async Task<AuthenticatedUser> ToAuthenticatedUserAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        return new AuthenticatedUser(user.Id, user.Email!, user.Name, roles.ToList());
    }
}
