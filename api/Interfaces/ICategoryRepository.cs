using Library.Api.Models;

namespace Api.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetActiveCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<Category> CreateCategoryAsync(Category category);
        Task<Category?> UpdateCategoryAsync(int id, Category updated);
        Task<bool> DeleteCategoryAsync(int id); // soft delete (IsActive = false)
    }
}