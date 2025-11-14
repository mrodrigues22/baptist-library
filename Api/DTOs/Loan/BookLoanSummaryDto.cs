namespace Library.Api.DTOs.Loan
{
    public class BookLoanSummaryDto
    {
        public int Id { get; set; }
        public required string Reader { get; set; }
        public DateTime? CheckoutDate { get; set; }
        public required string Status { get; set; }
    }
}
