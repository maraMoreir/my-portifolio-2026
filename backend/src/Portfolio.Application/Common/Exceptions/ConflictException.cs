namespace Portfolio.Application.Common.Exceptions;

/// <summary>Maps to HTTP 409 in the API's exception-handling middleware.</summary>
public class ConflictException : Exception
{
    public ConflictException(string message) : base(message)
    {
    }
}
