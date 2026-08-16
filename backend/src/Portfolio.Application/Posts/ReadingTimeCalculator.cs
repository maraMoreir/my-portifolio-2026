namespace Portfolio.Application.Posts;

/// <summary>Mirrors the frontend's `calculateReadingTime` (200 words/minute), now computed once on the backend instead of being a client-side-only concern.</summary>
public static class ReadingTimeCalculator
{
    private const int WordsPerMinute = 200;

    public static int Calculate(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return 1;
        }

        var wordCount = content.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries).Length;
        return Math.Max(1, (int)Math.Ceiling(wordCount / (double)WordsPerMinute));
    }
}
