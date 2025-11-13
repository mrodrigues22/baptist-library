using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DTOs.Loan;
using Api.Helpers;
using Api.Helpers.Loan;
using Library.Api.Models;

namespace Api.Interfaces
{
    public interface ILoanRepository
    {
        Task<PagedResult<Loan>> GetPagedLoansAsync(QueryObject queryObject, CancellationToken cancellationToken = default);
        Task<Loan?> GetLoanAsync(int id, CancellationToken cancellationToken = default);
        Task<Loan> CreateLoanAsync(Loan loan, CancellationToken cancellationToken = default);
        Task<Loan?> CheckOut(int id, string userId, CancellationToken cancellationToken = default);
        Task<Loan?> CheckBack(int id, string userId, CancellationToken cancellationToken = default);
        Task<(bool Success, string? ErrorMessage, Loan? Loan)> CreateLoanForSelfWithValidationAsync(int bookId, string userId, CancellationToken cancellationToken = default);
    }
}