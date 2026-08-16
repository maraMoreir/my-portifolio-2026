namespace Portfolio.Application.Common.Exceptions;

/// <summary>Maps to HTTP 404 in the API's exception-handling middleware.</summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {
    }
}
