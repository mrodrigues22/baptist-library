using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations; // Add this using directive

namespace Library.Models
{
    public class ApplicationUser : IdentityUser // Correct inheritance
    {
        [Required]
        [Display(Name = "Nome")]
        public string FirstName { get; set; }

        [Required]
        [Display(Name = "Sobrenome")]
        public string LastName { get; set; }

        [Required]
        public bool Active { get; set; }

    }
}