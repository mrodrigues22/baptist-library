using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DTOs.Loan
{
    public class LoanDetailDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public required string BookTitle { get; set; }
        public required string RequesterUserId { get; set; }
        public required string Requester { get; set; }
        public int StatusId { get; set; }
        public required string StatusName { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? CheckoutDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public DateTime? ExpectedReturnDate { get; set; }
        public string? CheckedOutBy { get; set; }
        public string? ReceivedBy { get; set; }
    }
}
