using Api.DTOs.Loan;
using Library.Api.DTOs.Loan;
using Library.Api.Models;

namespace Library.Api.Mappers
{
    public static class LoanMappers
    {
        public static LoanSummaryDto ToLoanSummaryDto(this Loan loan)
        {
            return new LoanSummaryDto
            {
                Id = loan.Id,
                Book = loan.Book.Title,
                Reader = loan.RequesterUser?.FirstName + " " + loan.RequesterUser?.LastName ?? "Unknown",
                RequestDate = loan.RequestDate,
                Status = loan.Status.Description
            };
        }

        public static LoanDetailDto ToLoanDetailDto(this Loan loan)
        {
            return new LoanDetailDto
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

        public static Loan ToLoanFromCreateDto(this CreateLoanDto createLoanDto, string checkedOutByUserId)
        {
            return new Loan
            {
                BookId = createLoanDto.BookId,
                RequesterUserId = createLoanDto.RequesterUserId,
                CheckedOutBy = checkedOutByUserId,
                RequestDate = DateTime.UtcNow,
                StatusId = 2
            };
        }

        public static Loan ToLoanFromBorrowDto(this BorrowBookDto borrowBookDto, string userId)
        {
            return new Loan
            {
                BookId = borrowBookDto.BookId,
                RequesterUserId = userId,
                CheckedOutBy = userId,
                RequestDate = DateTime.UtcNow,
                StatusId = 2
            };
        }
    }
}
