using Library.Api.Models;

namespace Api.Interfaces
{
    public interface ISettingRepository
    {
        Task<List<Setting>> GetAllSettingsAsync();
        Task<Setting?> GetSettingByIdAsync(int id);
        Task<Setting?> UpdateSettingAsync(int id, int value);
    }
}
