using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Loan
{
    public class CreateLoanForSelfDto
    {
        [Required]
        public int BookId { get; set; }
    }
}
