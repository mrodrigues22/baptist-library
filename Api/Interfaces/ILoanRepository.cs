using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Library.Api.Models;

namespace Api.Interfaces
{
    public interface ILoanRepository
    {
        Task<List<Loan>> GetAllLoansAsync();
    }
}