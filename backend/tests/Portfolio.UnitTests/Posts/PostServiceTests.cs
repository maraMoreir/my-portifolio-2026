using Moq;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Posts;
using Portfolio.Application.Posts.Dtos;
using Portfolio.Domain.Posts;
using Portfolio.Domain.Tags;

namespace Portfolio.UnitTests.Posts;

public class PostServiceTests
{
    private readonly Mock<IPostRepository> _repository = new();
    private readonly PostService _sut;

    public PostServiceTests()
    {
        _sut = new PostService(_repository.Object);
    }

    [Fact]
    public async Task CreateAsync_appends_a_numeric_suffix_when_the_slug_already_exists()
    {
        _repository.SetupSequence(r => r.SlugExistsAsync("titulo-repetido", null, default))
            .ReturnsAsync(true)
            .ReturnsAsync(false);
        _repository
            .Setup(r => r.GetOrCreateTagsAsync(It.IsAny<IEnumerable<string>>(), default))
            .ReturnsAsync([]);

        var request = new CreatePostRequest("Título Repetido", "conteúdo", null, null);
        var authorId = Guid.NewGuid();

        var result = await _sut.CreateAsync(request, authorId, default);

        Assert.Equal("titulo-repetido-2", result.Slug);
        _repository.Verify(r => r.AddAsync(It.IsAny<Post>(), default), Times.Once);
        _repository.Verify(r => r.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_throws_conflict_when_the_new_slug_belongs_to_another_post()
    {
        var post = new Post("Título Original", "titulo-original", "conteúdo", null, Guid.NewGuid());
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync(post);
        _repository.Setup(r => r.SlugExistsAsync("titulo-novo", It.IsAny<Guid?>(), default)).ReturnsAsync(true);

        var request = new UpdatePostRequest("Título Novo", "conteúdo atualizado", null, null);

        await Assert.ThrowsAsync<ConflictException>(() => _sut.UpdateAsync(Guid.NewGuid(), request, default));
    }

    [Fact]
    public async Task GetPostForAdminAsync_throws_not_found_when_post_does_not_exist()
    {
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Post?)null);

        await Assert.ThrowsAsync<NotFoundException>(() => _sut.GetPostForAdminAsync(Guid.NewGuid(), default));
    }

    [Fact]
    public async Task PublishAsync_persists_the_status_change()
    {
        var post = new Post("Título", "titulo", "conteúdo", null, Guid.NewGuid());
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync(post);

        var result = await _sut.PublishAsync(Guid.NewGuid(), default);

        Assert.Equal(nameof(PostStatus.Published), result.Status);
        _repository.Verify(r => r.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_removes_the_post_and_saves()
    {
        var post = new Post("Título", "titulo", "conteúdo", null, Guid.NewGuid());
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync(post);

        await _sut.DeleteAsync(Guid.NewGuid(), default);

        _repository.Verify(r => r.Remove(post), Times.Once);
        _repository.Verify(r => r.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task GetPublishedPostsAsync_maps_tags_ordered_alphabetically()
    {
        var post = new Post("Título", "titulo", "conteúdo", null, Guid.NewGuid());
        post.SetTags([new Tag("Zebra"), new Tag("Alpha")]);
        _repository.Setup(r => r.GetPublishedAsync(default)).ReturnsAsync([post]);

        var result = await _sut.GetPublishedPostsAsync(default);

        Assert.Equal(["Alpha", "Zebra"], result.Single().Tags);
    }
}
