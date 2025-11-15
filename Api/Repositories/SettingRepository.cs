using Api.Data;
using Api.Interfaces;
using Library.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class SettingRepository : ISettingRepository
    {
        private readonly ApplicationDbContext _context;

        public SettingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Setting>> GetAllSettingsAsync()
        {
            return await _context.Settings.ToListAsync();
        }

        public async Task<Setting?> GetSettingByIdAsync(int id)
        {
            return await _context.Settings.FindAsync(id);
        }

        public async Task<Setting?> UpdateSettingAsync(int id, int value)
        {
            var setting = await _context.Settings.FindAsync(id);
            
            if (setting == null)
            {
                return null;
            }

            setting.Value = value;
            await _context.SaveChangesAsync();

            return setting;
        }
    }
}
