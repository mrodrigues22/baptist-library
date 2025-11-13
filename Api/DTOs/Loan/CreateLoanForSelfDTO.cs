using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Loan
{
    public class BorrowBookDto
    {
        [Required]
        public int BookId { get; set; }
    }
}
