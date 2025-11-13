using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Category
{
    public class CreateCategoryDto
    {
        [Required]
        [StringLength(255)]
        [MinLength(3, ErrorMessage = "The category description must be at least 3 characters long.")]
        public string Description { get; set; } = string.Empty;
    }
}