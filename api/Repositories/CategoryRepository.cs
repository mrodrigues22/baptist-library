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

        public async Task<List<Category>> GetCategoriesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Categories
                .Where(c => c.IsActive)
                .OrderBy(c => c.Description)
                .ToListAsync(cancellationToken);
        }

        public async Task<Category?> GetCategoryAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive, cancellationToken);
        }

        public async Task<Category> CreateCategoryAsync(Category category, CancellationToken cancellationToken = default)
        {
            category.IsActive = true;
            category.Description = category.Description.Trim();
            _context.Categories.Add(category);
            await _context.SaveChangesAsync(cancellationToken);
            return category;
        }

        public async Task<Category?> UpdateCategoryAsync(int id, Category updated, CancellationToken cancellationToken = default)
        {
            var existing = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive, cancellationToken);
            if (existing == null) return null;
            existing.Description = updated.Description.Trim();
            await _context.SaveChangesAsync(cancellationToken);
            return existing;
        }

        public async Task<bool> DeleteCategoryAsync(int id, CancellationToken cancellationToken = default)
        {
            var existing = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive, cancellationToken);
            if (existing == null) return false;
            existing.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> CategoryExistsAsync(string description, int? excludeId = null, CancellationToken cancellationToken = default)
        {
            var normalizedDescription = description.Trim().ToLower();
            var query = _context.Categories
                .Where(c => c.IsActive && c.Description.ToLower() == normalizedDescription);
            
            if (excludeId.HasValue)
            {
                query = query.Where(c => c.Id != excludeId.Value);
            }

            return await query.AnyAsync(cancellationToken);
        }
    }
}