using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common.Exceptions;

namespace Portfolio.Api.Middleware;

/// <summary>
/// Translates exceptions into RFC 7807 ProblemDetails responses and makes
/// sure nothing internal (stack traces, SQL, connection strings) ever
/// reaches the client — 5xx responses always get a generic message, even
/// in Development, while the real exception is always logged server-side.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (statusCode, title) = MapException(ex);

            if (statusCode >= 500)
            {
                _logger.LogError(ex, "Unhandled exception processing {Method} {Path}", context.Request.Method, context.Request.Path);
            }
            else
            {
                _logger.LogWarning("{Title}: {Message}", title, ex.Message);
            }

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = statusCode;

            var problem = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = statusCode < 500 ? ex.Message : "Ocorreu um erro inesperado.",
            };

            await context.Response.WriteAsJsonAsync(problem);
        }
    }

    private static (int StatusCode, string Title) MapException(Exception ex) => ex switch
    {
        NotFoundException => (StatusCodes.Status404NotFound, "Recurso não encontrado"),
        ConflictException => (StatusCodes.Status409Conflict, "Conflito"),
        UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Não autorizado"),
        ArgumentException or InvalidOperationException => (StatusCodes.Status400BadRequest, "Requisição inválida"),
        _ => (StatusCodes.Status500InternalServerError, "Erro interno"),
    };
}
