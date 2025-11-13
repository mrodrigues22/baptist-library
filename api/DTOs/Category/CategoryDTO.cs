using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Category
{
    public class CategoryDto
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Categoria")]
        public string Description { get; set; } = string.Empty;
    }
}