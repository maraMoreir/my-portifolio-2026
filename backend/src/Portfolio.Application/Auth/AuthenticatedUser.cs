namespace Portfolio.Application.Auth;

/// <summary>User identity + roles as resolved by the auth provider (Identity today), independent of how the token that will represent it gets issued.</summary>
public sealed record AuthenticatedUser(Guid Id, string Email, string Name, IReadOnlyList<string> Roles);
