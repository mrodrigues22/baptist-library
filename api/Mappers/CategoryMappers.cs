using Api.DTOs.Category;
using Library.Api.Models;

namespace Api.Mappers
{
    public static class CategoryMappers
    {
        public static CategoryDto ToCategoryDto(this Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Description = category.Description
            };
        }

        public static Category ToCategoryFromCreateDto(this CreateCategoryDto dto)
        {
            return new Category
            {
                Description = dto.Description.Trim(),
                IsActive = true
            };
        }
    }
}