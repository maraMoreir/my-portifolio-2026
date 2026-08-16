using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Contracts.Auth;

public sealed record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);
