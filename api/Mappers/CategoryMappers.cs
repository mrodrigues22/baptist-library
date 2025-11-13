using Api.DTOs.Category;
using Library.Api.Models;

namespace Api.Mappers
{
    public static class CategoryMappers
    {
        public static CategoryDTO ToCategoryDTO(this Category category)
        {
            return new CategoryDTO
            {
                Id = category.Id,
                Description = category.Description
            };
        }
    }
}