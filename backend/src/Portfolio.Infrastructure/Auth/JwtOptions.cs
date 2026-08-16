namespace Portfolio.Infrastructure.Auth;

/// <summary>Bound from the "Jwt" config section. Only SigningKey is a secret — the rest lives in appsettings.json.</summary>
public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;

    /// <summary>Never committed — provided via user-secrets (dev) or the Jwt__SigningKey environment variable (prod).</summary>
    public string SigningKey { get; set; } = string.Empty;

    public int AccessTokenMinutes { get; set; } = 15;
    public int RefreshTokenDays { get; set; } = 14;
}
