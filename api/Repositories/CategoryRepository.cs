using Api.Data;
using Api.Interfaces;
using Library.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetActiveCategoriesAsync()
        {
            return await _context.Categories
                .Where(c => c.IsActive)
                .OrderBy(c => c.Description)
                .ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            category.IsActive = true;
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> UpdateCategoryAsync(int id, Category updated)
        {
            var existing = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
            if (existing == null) return null;
            existing.Description = updated.Description;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var existing = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
            if (existing == null) return false;
            existing.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}