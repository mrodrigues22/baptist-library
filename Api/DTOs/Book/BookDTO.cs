using System.ComponentModel.DataAnnotations;

namespace Library.Api.DTOs.Book;

public class BookDTO
{
    public int Id { get; set; }

    [Display(Name = "Título")]
    public string Title { get; set; }

    [Display(Name = "Edição")]
    public int Edition { get; set; }

    [Display(Name = "Editora")]
    public string Publisher { get; set; }

    [Display(Name = "Ano de publicação")]
    public int? PublicationYear { get; set; }

    [Display(Name = "Volume")]
    public int? Volume { get; set; }

    [Display(Name = "ISBN")]
    public string Isbn { get; set; }

    [Display(Name = "CDD")]
    public string Cdd { get; set; }

    [Display(Name = "Localização na biblioteca")]
    public string LibraryLocation { get; set; }

    [Display(Name = "Quantidade de exemplares")]
    public int Quantity { get; set; }

    [Display(Name = "Exemplares disponíveis")]
    public int AvailableCopies { get; set; }

    [Display(Name = "Origem")]
    public string Origin { get; set; }

    [Display(Name = "Autor(es)")]
    public List<string> Authors { get; set; } = new List<string>();

    [Display(Name = "Gênero(s)")]
    public List<string> Categories { get; set; } = new List<string>();

    [Display(Name = "Palavras-chave")]
    public List<string> Tags { get; set; } = new List<string>();

    [Display(Name = "Cadastrado por")]
    public string? CreatedByUser { get; set; }

    [Display(Name = "Data de cadastro")]
    public DateTime CreatedDate { get; set; }

    [Display(Name = "Modificado por")]
    public string? ModifiedByUser { get; set; }

    [Display(Name = "Última modificação")]
    public DateTime? ModifiedDate { get; set; }

}
