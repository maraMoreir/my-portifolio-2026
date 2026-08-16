using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Portfolio.Application.Posts;

/// <summary>Pure, side-effect-free slug generation — mirrors the intent of the (currently unused) frontend `generateSlug` helper, but transliterates accents instead of dropping them, which reads better for pt-BR titles.</summary>
public static partial class SlugGenerator
{
    public static string Generate(string title)
    {
        var normalized = RemoveDiacritics(title.Trim().ToLowerInvariant());
        normalized = NonSlugCharsRegex().Replace(normalized, "");
        normalized = WhitespaceRegex().Replace(normalized, "-");
        normalized = DashesRegex().Replace(normalized, "-");
        return normalized.Trim('-');
    }

    private static string RemoveDiacritics(string text)
    {
        var decomposed = text.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();

        foreach (var c in decomposed)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(c);
            }
        }

        return builder.ToString().Normalize(NormalizationForm.FormC);
    }

    [GeneratedRegex(@"[^a-z0-9\s-]")]
    private static partial Regex NonSlugCharsRegex();

    [GeneratedRegex(@"\s+")]
    private static partial Regex WhitespaceRegex();

    [GeneratedRegex(@"-+")]
    private static partial Regex DashesRegex();
}
