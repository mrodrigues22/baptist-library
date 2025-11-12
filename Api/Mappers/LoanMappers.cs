using Api.DTOs.Loan;
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
                Id = loan.Id,
                Book = loan.Book.Title,
                Reader = loan.RequesterUser?.FirstName + " " + loan.RequesterUser?.LastName ?? "Unknown",
                RequestDate = loan.RequestDate,
                Status = loan.Status.Description
            };
        }

        public static LoanDTO ToLoanDTO(this Loan loan)
        {
            return new LoanDTO
            {
                Id = loan.Id,
                BookId = loan.BookId,
                BookTitle = loan.Book.Title,
                RequesterUserId = loan.RequesterUserId,
                Requester = $"{loan.RequesterUser?.FirstName} {loan.RequesterUser?.LastName}",
                StatusId = loan.StatusId,
                StatusName = loan.Status.Description,
                RequestDate = loan.RequestDate,
                CheckoutDate = loan.CheckoutDate,
                ReturnDate = loan.ReturnDate,
                ExpectedReturnDate = loan.ExpectedReturnDate,
                CheckedOutBy = loan.CheckedOutByUser != null
                    ? $"{loan.CheckedOutByUser.FirstName} {loan.CheckedOutByUser.LastName}"
                    : null,
                ReceivedBy = loan.ReceivedByUser != null
                    ? $"{loan.ReceivedByUser.FirstName} {loan.ReceivedByUser.LastName}"
                    : null
            };
        }

        public static Loan ToLoanFromCreateDTO(this CreateLoanDTO createLoanDTO)
        {
            return new Loan
            {
                BookId = createLoanDTO.BookId,
                RequesterUserId = createLoanDTO.RequesterUserId,
                CheckedOutBy = createLoanDTO.CheckedOutBy,
                RequestDate = DateTime.UtcNow,
                StatusId = 2
            };
        }
    }
}
