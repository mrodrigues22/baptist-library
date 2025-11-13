using System.ComponentModel.DataAnnotations;

namespace Library.Api.DTOs.Book;

public class BookSummaryDto
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

    [Display(Name = "Quantidade total de exemplares")]
    public int Quantity { get; set; }

    [Display(Name = "Já reservado pelo usuário atual")]
    public bool BorrowedByCurrentUser { get; set; }
}
