using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.User
{
    public class AssignRoleDTO
    {
        [Required(ErrorMessage = "O perfil é obrigatório")]
        public string RoleName { get; set; } = string.Empty;
    }
}
