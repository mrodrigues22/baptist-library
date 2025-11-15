using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Loan
{
    public class CreateLoanDto
    {
        [Required]
        public int BookId { get; set; }
        
        [Required]
        public string RequesterUserId { get; set; } = string.Empty;
    }
}
