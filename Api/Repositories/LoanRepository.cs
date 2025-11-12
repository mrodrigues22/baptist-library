using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
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

        public async Task<Loan?> CheckBack(int id, string userId)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null || loan.StatusId != 2 && loan.StatusId != 5)
            {
                return null;
            }

            loan.StatusId = 3;
            loan.ReturnDate = DateTime.UtcNow;
            loan.ReceivedBy = userId;
            await _context.SaveChangesAsync();

            return await GetLoanByIdAsync(id);
        }

        public async Task<(bool Success, string? ErrorMessage, Loan? Loan)> CreateLoanForSelfWithValidationAsync(int bookId, string userId)
        {
            var book = await _context.Books
                .Include(b => b.Loans)
                .FirstOrDefaultAsync(b => b.Id == bookId);

            if (book == null)
            {
                return (false, "Book not found.", null);
            }

            // Check if book is available
            var activeLoansCount = book.Loans.Count(l => l.StatusId == 1 || l.StatusId == 2 || l.StatusId == 5);
            if (book.QuantityAvailable <= activeLoansCount)
            {
                return (false, "This book is not available.", null);
            }

            // Check if user already has an active loan for this book
            var existingLoan = await _context.Loans
                .FirstOrDefaultAsync(l => l.BookId == bookId &&
                                     l.RequesterUserId == userId &&
                                     l.ReturnDate == null);

            if (existingLoan != null)
            {
                return (false, "You already have an active loan for this book.", null);
            }

            // Check if user has reached loan limit
            var userActiveLoansCount = await _context.Loans
                .CountAsync(l => l.RequesterUserId == userId && 
                            (l.StatusId == 1 || l.StatusId == 2 || l.StatusId == 5));

            var loanLimit = await _context.Settings
                .Where(s => s.Id == 1)
                .Select(s => s.Value)
                .FirstOrDefaultAsync();

            if (userActiveLoansCount >= loanLimit)
            {
                return (false, "You have reached the limit of books you can borrow.", null);
            }

            // Create the loan
            var loan = new Loan
            {
                BookId = bookId,
                RequesterUserId = userId,
                StatusId = 1,
                RequestDate = DateTime.UtcNow
            };

            await _context.Loans.AddAsync(loan);
            await _context.SaveChangesAsync();

            var createdLoan = await GetLoanByIdAsync(loan.Id);
            return (true, null, createdLoan);
        }
    }
}