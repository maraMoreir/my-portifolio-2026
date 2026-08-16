namespace Portfolio.Application.Auth;

/// <summary>Port over the credential store (Identity's UserManager in Infrastructure). Never exposes password hashes or Identity types to the Application layer.</summary>
public interface IPasswordAuthenticator
{
    /// <summary>Returns null on any invalid-credential case (unknown email, wrong password, locked-out account) — deliberately without saying which, to avoid user enumeration.</summary>
    Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password, CancellationToken ct = default);

    Task<AuthenticatedUser?> GetByIdAsync(Guid userId, CancellationToken ct = default);
}
