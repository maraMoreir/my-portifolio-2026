using Microsoft.AspNetCore.Identity;

namespace Portfolio.Infrastructure.Identity;

/// <summary>
/// Extends ASP.NET Core Identity's user with a display name. Using Identity
/// here (instead of a hand-rolled users table) gets battle-tested password
/// hashing, lockout, and role management for free, while still supporting
/// a single admin today — roles/policies are already wired for when a
/// second user is added.
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    public string Name { get; set; } = string.Empty;
}
