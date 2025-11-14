using Api.DTOs.User;
using Api.Helpers.Users;
using Api.Interfaces;
using Api.Mappers;
using Library.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(
            IUserRepository userRepository,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> GetUsers([FromQuery] QueryObject queryObject)
        {
            try
            {
                var users = await _userRepository.GetUsersAsync(queryObject);
                var userDtos = new List<UserListDTO>();

                foreach (var user in users)
                {
                    var roles = await _userRepository.GetUserRolesAsync(user.Id);
                    var role = roles.FirstOrDefault();
                    userDtos.Add(user.ToUserListDTO(role));
                }

                return Ok(new
                {
                    users = userDtos,
                    hasPendingUsers = await _userRepository.HasPendingUsersAsync()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro ao carregar dados: {ex.Message}" });
            }
        }

        // GET: api/users/pending
        [HttpGet("pending")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> GetPendingUsers([FromQuery] QueryObject queryObject)
        {
            try
            {
                queryObject.PendingApprovalOnly = true;
                var users = await _userRepository.GetUsersAsync(queryObject);
                var userDtos = users.Select(u => u.ToUserListDTO(null)).ToList();

                // Get assignable roles based on current user's permissions
                var assignableRoles = await GetAssignableRoles();

                return Ok(new
                {
                    users = userDtos,
                    assignableRoles
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro ao carregar dados: {ex.Message}" });
            }
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserDetails(string id)
        {
            try
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                // Users can view their own profile, or staff roles can view any profile
                var canViewProfile = id == currentUserId || 
                                   User.IsInRole("Administrador") || 
                                   User.IsInRole("Desenvolvedor") || 
                                   User.IsInRole("Bibliotecário");
                
                if (!canViewProfile)
                {
                    return Forbid();
                }

                var user = await _userRepository.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                var roles = await _userRepository.GetUserRolesAsync(id);
                var totalLoans = await _userRepository.GetUserTotalLoansAsync(id);
                var activeLoans = await _userRepository.GetUserActiveLoansAsync(id);
                
                // Only provide assignableRoles for staff members
                var assignableRoles = canViewProfile && id != currentUserId 
                    ? await GetAssignableRoles() 
                    : new List<string>();

                var userDto = user.ToUserDetailDTO(roles, totalLoans, activeLoans);

                return Ok(new
                {
                    user = userDto,
                    assignableRoles
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Erro ao carregar dados: {ex.Message}" });
            }
        }

        // POST: api/users
        [HttpPost]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO createDto)
        {
            try
            {
                var user = createDto.ToApplicationUserFromCreateDTO();
                var createdUser = await _userRepository.CreateUserAsync(user, createDto.Password, createDto.RoleName);

                var roles = await _userRepository.GetUserRolesAsync(createdUser.Id);
                var totalLoans = 0;
                var activeLoans = 0;

                return CreatedAtAction(
                    nameof(GetUserDetails),
                    new { id = createdUser.Id },
                    createdUser.ToUserDetailDTO(roles, totalLoans, activeLoans)
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDTO updateDto)
        {
            try
            {
                var userToUpdate = updateDto.ToApplicationUserFromUpdateDTO();
                var updatedUser = await _userRepository.UpdateUserAsync(id, userToUpdate, updateDto.Password);

                if (updatedUser == null)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                var roles = await _userRepository.GetUserRolesAsync(updatedUser.Id);
                var totalLoans = await _userRepository.GetUserTotalLoansAsync(updatedUser.Id);
                var activeLoans = await _userRepository.GetUserActiveLoansAsync(updatedUser.Id);

                return Ok(updatedUser.ToUserDetailDTO(roles, totalLoans, activeLoans));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/users/{id}/assign-role
        [HttpPost("{id}/assign-role")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AssignRole(string id, [FromBody] AssignRoleDTO assignRoleDto)
        {
            try
            {
                // Check if user can assign this role
                if (!await CanAssignRole(assignRoleDto.RoleName))
                {
                    return Forbid();
                }

                var success = await _userRepository.AssignRoleAsync(id, assignRoleDto.RoleName);
                if (!success)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                var user = await _userRepository.GetUserByIdAsync(id);
                return Ok(new { message = $"Perfil {assignRoleDto.RoleName} atribuído com sucesso para {user!.FirstName}" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/users/{id}/deactivate
        [HttpPost("{id}/deactivate")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> DeactivateUser(string id)
        {
            try
            {
                var success = await _userRepository.DeactivateUserAsync(id);
                if (!success)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                return Ok(new { message = "Usuário desativado com sucesso. Todos os perfis foram removidos." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (id == currentUserId)
                {
                    return BadRequest(new { message = "Você não pode deletar seu próprio usuário." });
                }

                var success = await _userRepository.DeleteUserAsync(id);
                if (!success)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                return Ok(new { message = "Usuário deletado com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private async Task<List<string>> GetAssignableRoles()
        {
            var allRoles = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
            var assignableRoles = new List<string>();

            foreach (var role in allRoles)
            {
                if (role == null) continue;

                bool canAssign = false;
                
                if (User.IsInRole("Desenvolvedor"))
                {
                    canAssign = true;
                }
                else if (User.IsInRole("Administrador"))
                {
                    canAssign = role == "Administrador" || role == "Bibliotecário" || role == "Membro";
                }
                else if (User.IsInRole("Bibliotecário"))
                {
                    canAssign = role == "Bibliotecário" || role == "Membro";
                }
                else
                {
                    canAssign = false;
                }

                if (canAssign)
                {
                    assignableRoles.Add(role);
                }
            }

            return assignableRoles;
        }

        private async Task<bool> CanAssignRole(string roleName)
        {
            if (User.IsInRole("Desenvolvedor"))
            {
                return true;
            }
            
            if (User.IsInRole("Administrador"))
            {
                return roleName == "Administrador" || roleName == "Bibliotecário" || roleName == "Membro";
            }
            
            if (User.IsInRole("Bibliotecário"))
            {
                return roleName == "Bibliotecário" || roleName == "Membro";
            }
            
            return false;
        }
    }
}
