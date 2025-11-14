using System.ComponentModel.DataAnnotations;
using Api.Attributes;

namespace Library.Api.DTOs.Book
{
    public class UpdateBookDto
    {
        [Required]
        [StringLength(255)]
        [MinLength(5, ErrorMessage = "The title must be at least 5 characters long.")]
        [MaxLength(255, ErrorMessage = "The title cannot exceed 255 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Edition must be a positive number.")]
        public int Edition { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Publication year must be a positive number.")]
        public int? PublicationYear { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "Volume must be a positive number.")]
        public int? Volume { get; set; }

        [Required]
        [StringLength(255)]
        [MinLength(5, ErrorMessage = "The publisher name must be at least 5 characters long.")]
        [MaxLength(255, ErrorMessage = "The publisher name cannot exceed 255 characters.")]
        public string PublisherName { get; set; } = string.Empty;

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Quantity available must be zero or positive.")]
        public int QuantityAvailable { get; set; }

        [RegularExpression(@"^(\d{10}|\d{13})$", ErrorMessage = "The ISBN must be exactly 10 or 13 digits.")]
        public string? Isbn { get; set; }

        [StringLength(50)]
        [MinLength(3, ErrorMessage = "The CDD must be at least 3 characters long.")]
        [MaxLength(50, ErrorMessage = "The CDD cannot exceed 50 characters.")]
        public string? Cdd { get; set; }

        [StringLength(255)]
        [MinLength(2, ErrorMessage = "The library location must be at least 5 characters long.")]
        [MaxLength(255, ErrorMessage = "The library location cannot exceed 255 characters.")]
        public string? LibraryLocation { get; set; }

        [StringLength(255)]
        public string? Origin { get; set; }

        [Required(ErrorMessage = "At least one author is required.")]
        [MinListLength(1, ErrorMessage = "At least one author is required.")]
        public List<string> AuthorNames { get; set; } = new List<string>();

        public List<string> TagWords { get; set; } = new List<string>();

        public List<string> Categories { get; set; } = new List<string>();
    }
}
