using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Category
{
    public class UpdateCategoryDTO
    {
        [Required]
        [StringLength(255)]
        public string Description { get; set; } = string.Empty;
    }
}