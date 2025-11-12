using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.User
{
    public class UserDetailDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public bool Active { get; set; }
        public int TotalLoans { get; set; }
        public int ActiveLoans { get; set; }
    }
}
