using Library.Api.DTOs.Loan;
using Library.Api.Models;

namespace Library.Api.Mappers
{
    public static class LoanMappers
    {
        public static LoansDTO ToLoansDTO(this Loan loan)
        {
            return new LoansDTO
            {
                Book = loan.Book.Title,
                Reader = loan.RequesterUser?.FirstName + " " + loan.RequesterUser?.LastName ?? "Unknown",
                RequestDate = loan.RequestDate,
                Status = loan.Status.Description
            };
        }
    }
}
