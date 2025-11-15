using Library.Api.Models;

namespace Api.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetCategoriesAsync(CancellationToken cancellationToken = default);
        Task<Category?> GetCategoryAsync(int id, CancellationToken cancellationToken = default);
        Task<Category> CreateCategoryAsync(Category category, CancellationToken cancellationToken = default);
        Task<Category?> UpdateCategoryAsync(int id, Category updated, CancellationToken cancellationToken = default);
        Task<bool> DeleteCategoryAsync(int id, CancellationToken cancellationToken = default);
        Task<bool> CategoryExistsAsync(string description, int? excludeId = null, CancellationToken cancellationToken = default);
    }
}