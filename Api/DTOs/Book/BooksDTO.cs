using System.ComponentModel.DataAnnotations;

namespace Library.api.DTOs.Book;

public class BooksDTO
{
    public int Id { get; set; }

    [Display(Name = "Título")]
    public required string Title { get; set; }

    [Display(Name = "Autor(es)")]
    public List<string> Authors { get; set; } = new List<string>();

    [Display(Name = "Edição")]
    public int Edition { get; set; }

    [Display(Name = "Editora")]
    public required string Publisher { get; set; }

    [Display(Name = "Ano de publicação")]
    public int? PublicationYear { get; set; }

    [Display(Name = "Exemplares disponíveis")]
    public int AvailableCopies { get; set; }
}