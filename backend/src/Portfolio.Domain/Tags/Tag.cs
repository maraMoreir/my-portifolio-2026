namespace Portfolio.Domain.Tags;

/// <summary>
/// A label posts can be filtered by. Kept as its own entity (instead of a
/// comma-separated column) so the existing tag-filter feature in the
/// frontend maps directly onto a normal, indexable relationship.
/// </summary>
public class Tag
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;

    private Tag()
    {
        // EF Core materialization.
    }

    public Tag(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("O nome da tag é obrigatório.", nameof(name));
        }

        Id = Guid.NewGuid();
        Name = name.Trim();
    }
}
