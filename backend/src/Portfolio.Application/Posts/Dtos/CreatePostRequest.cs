using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.Posts.Dtos;

public sealed record CreatePostRequest(
    [Required(ErrorMessage = "O título é obrigatório.")]
    [MaxLength(200)]
    string Title,

    [Required(ErrorMessage = "O conteúdo é obrigatório.")]
    string ContentMarkdown,

    [MaxLength(300)]
    string? Excerpt,

    IReadOnlyList<string>? Tags
);
