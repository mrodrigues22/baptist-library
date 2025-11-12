namespace Library.Api.DTOs.Loan
{
    public class LoansDTO
    {
        public required string Book { get; set; }
        public required string Reader { get; set; }
        public DateTime RequestDate { get; set; }
        public required string Status { get; set; }
    }
}
