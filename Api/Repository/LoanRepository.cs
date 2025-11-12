using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DTOs.Loan;
using Api.Helpers;
using Api.Helpers.Loan;
using Api.Interfaces;
using Library.Api.Mappers;
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
        public async Task<List<Loan>> GetAllLoansAsync(QueryObject queryObject)
        {
            var loans = _context.Loans
                .Include(l => l.Book)
                .Include(l => l.RequesterUser)
                .Include(l => l.Status)
                .AsQueryable();

            // Search filtering
            if (!string.IsNullOrWhiteSpace(queryObject.SearchTerm))
            {
                var tokens = queryObject.SearchTerm.Trim().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                foreach (var token in tokens)
                {
                    var pattern = $"%{token}%";
                    loans = loans.Where(l =>
                        EF.Functions.ILike(ApplicationDbContext.Unaccent(l.Book.Title), pattern) ||
                        (l.RequesterUser.UserName != null && EF.Functions.ILike(ApplicationDbContext.Unaccent(l.RequesterUser.UserName), pattern)) ||
                        EF.Functions.ILike(ApplicationDbContext.Unaccent(l.Status.Description), pattern)
                    );
                }
            }

            if (queryObject.Status.HasValue && queryObject.Status.Value <= 5)
            {
                loans = loans.Where(l => l.StatusId == queryObject.Status.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryObject.SortBy))
            {
                if (queryObject.SortBy.Equals("requestDate", StringComparison.OrdinalIgnoreCase))
                {
                    loans = queryObject.Descending ? loans.OrderByDescending(l => l.RequestDate) : loans.OrderBy(l => l.RequestDate);
                }
                else if (queryObject.SortBy.Equals("bookTitle", StringComparison.OrdinalIgnoreCase))
                {
                    loans = queryObject.Descending ? loans.OrderByDescending(l => l.Book.Title) : loans.OrderBy(l => l.Book.Title);
                }
                else if (queryObject.SortBy.Equals("requester", StringComparison.OrdinalIgnoreCase))
                {
                    loans = queryObject.Descending ? loans.OrderByDescending(l => l.RequesterUser.UserName) : loans.OrderBy(l => l.RequesterUser.UserName);
                }
                else if (queryObject.SortBy.Equals("status", StringComparison.OrdinalIgnoreCase))
                {
                    loans = queryObject.Descending ? loans.OrderByDescending(l => l.Status.Description) : loans.OrderBy(l => l.Status.Description);
                }
                else
                {
                    loans = loans.OrderByDescending(l => l.RequestDate);
                }
            }
            else
            {
                loans = loans.OrderByDescending(l => l.RequestDate);
            }

            int skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            int pageSize = Math.Min(queryObject.PageSize, 15);
            loans = loans.Skip(skip).Take(pageSize);

            return await loans.ToListAsync();
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

        public async Task<Loan> CreateLoanAsync(Loan loan)
        {
            

            await _context.Loans.AddAsync(loan);
            await _context.SaveChangesAsync();

            return await GetLoanByIdAsync(loan.Id) ?? loan;
        }

        public async Task<Loan?> CheckOut(int id, string userId)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null || loan.StatusId != 1)
            {
                return null;
            }

            loan.StatusId = 2;
            loan.CheckoutDate = DateTime.UtcNow;
            loan.CheckedOutBy = userId;
            await _context.SaveChangesAsync();

            return await GetLoanByIdAsync(id);
        }
    }
}