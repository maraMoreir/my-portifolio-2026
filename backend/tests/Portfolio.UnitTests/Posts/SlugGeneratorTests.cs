using Portfolio.Application.Posts;

namespace Portfolio.UnitTests.Posts;

public class SlugGeneratorTests
{
    [Theory]
    [InlineData("Clean Architecture na Prática", "clean-architecture-na-pratica")]
    [InlineData("  Espaços   extras  ", "espacos-extras")]
    [InlineData("C# & .NET: Integrações!", "c-net-integracoes")]
    [InlineData("já-com-hifens", "ja-com-hifens")]
    public void Generate_produces_a_url_safe_lowercase_slug(string title, string expected)
    {
        Assert.Equal(expected, SlugGenerator.Generate(title));
    }
}
