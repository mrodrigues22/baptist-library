using Api.DTOs.User;
using Api.Helpers.Users;
using Library.Api.Models;

namespace Api.Interfaces
{
    public interface IUserRepository
    {
        Task<List<ApplicationUser>> GetUsersAsync(QueryObject queryObject);
        Task<ApplicationUser?> GetUserByIdAsync(string id);
        Task<ApplicationUser> CreateUserAsync(ApplicationUser user, string password, string? roleName);
        Task<ApplicationUser?> UpdateUserAsync(string id, ApplicationUser user, string? newPassword);
        Task<bool> DeactivateUserAsync(string id);
        Task<bool> DeleteUserAsync(string id);
        Task<bool> AssignRoleAsync(string userId, string roleName);
        Task<List<string>> GetUserRolesAsync(string userId);
        Task<int> GetUserTotalLoansAsync(string userId);
        Task<int> GetUserActiveLoansAsync(string userId);
        Task<bool> HasPendingUsersAsync();
    }
}
