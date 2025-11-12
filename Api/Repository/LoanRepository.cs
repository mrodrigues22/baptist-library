using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Interfaces;
using Library.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repository
{
    public class LoanRepository : ILoanRepository
    {
        private readonly ApplicationDbContext _context;
        public LoanRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<Loan>> GetAllLoansAsync()
        {
            return await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.RequesterUser)
                .Include(l => l.Status)
                .ToListAsync();
        }

        public async Task<Loan?> GetLoanByIdAsync(int id)
        {
            return await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.RequesterUser)
                .Include(l => l.Status)
                .Include(l => l.CheckedOutByUser)
                .Include(l => l.ReceivedByUser)
                .FirstOrDefaultAsync(l => l.Id == id);
        }
    }
}