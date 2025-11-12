using Api.DTOs.User;
using Library.Api.Models;

namespace Api.Mappers
{
    public static class UserMappers
    {
        public static UserListDTO ToUserListDTO(this ApplicationUser user, string? role)
        {
            return new UserListDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                Role = role,
                Active = user.Active
            };
        }

        public static UserDetailDTO ToUserDetailDTO(this ApplicationUser user, List<string> roles, int totalLoans, int activeLoans)
        {
            return new UserDetailDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                Roles = roles,
                Active = user.Active,
                TotalLoans = totalLoans,
                ActiveLoans = activeLoans
            };
        }

        public static ApplicationUser ToApplicationUserFromCreateDTO(this CreateUserDTO createDto)
        {
            return new ApplicationUser
            {
                FirstName = createDto.FirstName,
                LastName = createDto.LastName,
                Email = createDto.Email,
                UserName = createDto.Email,
                PhoneNumber = createDto.PhoneNumber,
                Active = true
            };
        }

        public static ApplicationUser ToApplicationUserFromUpdateDTO(this UpdateUserDTO updateDto)
        {
            return new ApplicationUser
            {
                FirstName = updateDto.FirstName,
                LastName = updateDto.LastName,
                Email = updateDto.Email,
                UserName = updateDto.Email,
                PhoneNumber = updateDto.PhoneNumber
            };
        }
    }
}
