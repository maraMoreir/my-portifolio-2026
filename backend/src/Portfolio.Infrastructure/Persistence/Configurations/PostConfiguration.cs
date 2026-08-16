using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Posts;

namespace Portfolio.Infrastructure.Persistence.Configurations;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.ToTable("Posts");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Slug).HasMaxLength(220).IsRequired();
        builder.Property(p => p.Excerpt).HasMaxLength(300);
        builder.Property(p => p.ContentMarkdown).IsRequired();
        builder.Property(p => p.Status).HasConversion<string>().HasMaxLength(20);

        // Unique so two posts can never collide on the public URL.
        builder.HasIndex(p => p.Slug).IsUnique();

        // Covers the public listing query: published posts ordered by date.
        builder.HasIndex(p => new { p.Status, p.PublishedAt });

        // Implicit many-to-many (EF Core-managed join table) — no need for
        // an explicit PostTag entity since the relationship carries no data
        // of its own.
        builder.HasMany(p => p.Tags)
            .WithMany()
            .UsingEntity(join => join.ToTable("PostTags"));
    }
}
