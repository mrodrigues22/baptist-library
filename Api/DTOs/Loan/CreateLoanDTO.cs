namespace Api.DTOs.Loan
{
    public class CreateLoanDTO
    {
        public int BookId { get; set; }
        public string RequesterUserId { get; set; } = string.Empty;
        public string? CheckedOutBy { get; set; }
    }
}
