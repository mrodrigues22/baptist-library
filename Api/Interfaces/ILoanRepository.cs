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
        Task<List<Loan>> GetAllLoansAsync(QueryObject queryObject);
        Task<Loan?> GetLoanByIdAsync(int id);
        Task<Loan> CreateLoanAsync(Loan loan);
        Task<Loan?> CheckOut(int id, string userId);
        Task<Loan?> CheckBack(int id, string userId);
        Task<(bool Success, string? ErrorMessage, Loan? Loan)> CreateLoanForSelfWithValidationAsync(int bookId, string userId);
    }
}