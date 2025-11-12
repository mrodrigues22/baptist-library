using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DTOs.Loan;
using Library.Api.Models;

namespace Api.Interfaces
{
    public interface ILoanRepository
    {
        Task<List<Loan>> GetAllLoansAsync();
        Task<Loan?> GetLoanByIdAsync(int id);
        Task<Loan> CreateLoanAsync(Loan loan);
    }
}