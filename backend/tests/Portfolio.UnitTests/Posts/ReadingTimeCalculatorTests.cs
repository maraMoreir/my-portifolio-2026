using Portfolio.Application.Posts;

namespace Portfolio.UnitTests.Posts;

public class ReadingTimeCalculatorTests
{
    [Fact]
    public void Calculate_rounds_up_to_the_nearest_minute()
    {
        var content = string.Join(' ', Enumerable.Repeat("palavra", 250)); // 250 words

        var minutes = ReadingTimeCalculator.Calculate(content);

        Assert.Equal(2, minutes); // 250 / 200 = 1.25 -> rounds up to 2
    }

    [Fact]
    public void Calculate_returns_at_least_one_minute_for_short_content()
    {
        Assert.Equal(1, ReadingTimeCalculator.Calculate("poucas palavras"));
    }

    [Fact]
    public void Calculate_returns_one_for_empty_content()
    {
        Assert.Equal(1, ReadingTimeCalculator.Calculate(""));
    }
}
