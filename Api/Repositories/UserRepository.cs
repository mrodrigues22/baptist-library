using System.Globalization;
using System.Text;
using Api.Data;
using Api.Helpers.Users;
using Api.Interfaces;
using Library.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserRepository(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<List<ApplicationUser>> GetUsersAsync(QueryObject queryObject)
        {
            var query = _context.Users.AsQueryable();

            // Filter based on approval status
            if (queryObject.PendingApprovalOnly)
            {
                // Users without any roles
                query = query.Where(u => !_context.UserRoles.Any(ur => ur.UserId == u.Id) && u.Active);
            }
            else
            {
                // Retrieve the Desenvolvedor role ID
                var developerRoleId = await _roleManager.Roles
                    .Where(r => r.Name == "Desenvolvedor")
                    .Select(r => r.Id)
                    .FirstOrDefaultAsync();

                // Get users that have any role, but exclude those with the Desenvolvedor role
                query = query.Where(u => _context.UserRoles.Any(ur => ur.UserId == u.Id) &&
                                        !_context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == developerRoleId));

                // Filter active/inactive users
                if (!queryObject.IncludeInactive)
                {
                    query = query.Where(u => u.Active);
                }
            }

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(queryObject.Filter))
            {
                var processedFilter = RemoveAccents(queryObject.Filter.Trim()).ToLower();

                query = query.Where(u =>
                    EF.Functions.ILike(
                        ApplicationDbContext.Unaccent(u.FirstName) + " " + ApplicationDbContext.Unaccent(u.LastName),
                        $"%{processedFilter}%"
                    ) ||
                    EF.Functions.ILike(ApplicationDbContext.Unaccent(u.FirstName), $"%{processedFilter}%") ||
                    EF.Functions.ILike(ApplicationDbContext.Unaccent(u.LastName), $"%{processedFilter}%") ||
                    EF.Functions.ILike(ApplicationDbContext.Unaccent(u.Email ?? ""), $"%{processedFilter}%") ||
                    EF.Functions.ILike(ApplicationDbContext.Unaccent(u.PhoneNumber ?? ""), $"%{processedFilter}%")
                );
            }

            // Apply sorting
            query = queryObject.SortBy.ToLower() switch
            {
                "firstname" => query.OrderBy(u => u.FirstName),
                "lastname" => query.OrderBy(u => u.LastName),
                "email" => query.OrderBy(u => u.Email),
                _ => query.OrderBy(u => u.FirstName)
            };

            // Apply pagination
            int skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            int pageSize = Math.Min(queryObject.PageSize, 50);
            query = query.Skip(skip).Take(pageSize);

            return await query.ToListAsync();
        }

        public async Task<ApplicationUser?> GetUserByIdAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        public async Task<ApplicationUser> CreateUserAsync(ApplicationUser user, string password, string? roleName)
        {
            var result = await _userManager.CreateAsync(user, password);
            
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Assign role if provided, otherwise default to "Membro"
            var roleToAssign = !string.IsNullOrEmpty(roleName) ? roleName : "Membro";
            var roleResult = await _userManager.AddToRoleAsync(user, roleToAssign);
            
            if (!roleResult.Succeeded)
            {
                throw new Exception($"User created but failed to assign role: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
            }

            return user;
        }

        public async Task<ApplicationUser?> UpdateUserAsync(string id, ApplicationUser updatedUser, string? newPassword)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            // Update user properties
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.UserName = updatedUser.Email;
            user.PhoneNumber = updatedUser.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to update user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Update password if provided
            if (!string.IsNullOrEmpty(newPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, token, newPassword);
                
                if (!passwordResult.Succeeded)
                {
                    throw new Exception($"User updated but failed to change password: {string.Join(", ", passwordResult.Errors.Select(e => e.Description))}");
                }
            }

            return user;
        }

        public async Task<bool> DeactivateUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            // Remove all roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                var result = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!result.Succeeded)
                {
                    throw new Exception($"Failed to remove roles: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }

            // Anonymize user data
            user.Email = $"{user.Id}";
            user.NormalizedEmail = $"{user.Id}";
            user.UserName = $"{user.Id}";
            user.NormalizedUserName = $"{user.Id}";
            user.FirstName = "Usuário excluído";
            user.LastName = "";
            user.PhoneNumber = $"{user.Id}";
            user.Active = false;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            // Anonymize user data instead of deleting
            user.Email = $"{user.Id}";
            user.NormalizedEmail = $"{user.Id}";
            user.UserName = $"{user.Id}";
            user.NormalizedUserName = $"{user.Id}";
            user.FirstName = "Usuário excluído";
            user.LastName = "";
            user.PhoneNumber = $"{user.Id}";
            user.Active = false;

            _context.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignRoleAsync(string userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
            {
                throw new Exception("Invalid role name");
            }

            // Remove current roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            // Assign new role
            var result = await _userManager.AddToRoleAsync(user, roleName);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to assign role: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            return true;
        }

        public async Task<List<string>> GetUserRolesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new List<string>();
            }

            var roles = await _userManager.GetRolesAsync(user);
            return roles.ToList();
        }

        public async Task<int> GetUserTotalLoansAsync(string userId)
        {
            return await _context.Loans
                .Where(l => l.RequesterUserId == userId)
                .CountAsync();
        }

        public async Task<int> GetUserActiveLoansAsync(string userId)
        {
            return await _context.Loans
                .Where(l => l.RequesterUserId == userId && 
                           (l.StatusId == 1 || l.StatusId == 2 || l.StatusId == 5))
                .CountAsync();
        }

        public async Task<bool> HasPendingUsersAsync()
        {
            return await _context.Users
                .Where(u => !_context.UserRoles.Any(ur => ur.UserId == u.Id) && u.Active)
                .AnyAsync();
        }

        // Helper method to remove accents
        private static string RemoveAccents(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            string normalized = input.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();
            foreach (char c in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    sb.Append(c);
            }
            return sb.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
