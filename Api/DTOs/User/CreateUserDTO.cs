using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.User
{
    public class CreateUserDTO
    {
        [Required(ErrorMessage = "O nome é obrigatório")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "O sobrenome é obrigatório")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "O email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Telefone inválido")]
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória")]
        [MinLength(8, ErrorMessage = "A senha deve ter no mínimo 8 caracteres")]
        public string Password { get; set; } = string.Empty;

        public string? RoleName { get; set; }
    }
}
