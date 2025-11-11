using System.ComponentModel.DataAnnotations;

namespace Library.api.DTOs.Book
{
    public class CreateBookDTO
    {
        [Required]
        [StringLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public int Edition { get; set; }

        public int? PublicationYear { get; set; }

        public int? Volume { get; set; }

        [Required]
        public string PublisherName { get; set; } = string.Empty;

        [Required]
        public int QuantityAvailable { get; set; }

        [StringLength(50)]
        public string? Isbn { get; set; }

        [StringLength(50)]
        public string? Cdd { get; set; }

        [StringLength(255)]
        public string? LibraryLocation { get; set; }

        [StringLength(255)]
        public string? Origin { get; set; }

        public List<string> AuthorNames { get; set; } = new List<string>();

        public List<string> TagWords { get; set; } = new List<string>();

        public List<string> Categories { get; set; } = new List<string>();
    }
}
