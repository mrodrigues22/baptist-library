using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Library.Api.Models;
using Library.Api.DTOs.Book;

namespace Api.Interfaces
{
    public interface IBookRepository
    {
        Task<List<Book>> GetAllActiveBooksAsync();
        Task<Book?> GetActiveBookByIdAsync(int id);
        Task<Book> CreateBookAsync(CreateBookDTO bookDto, string userId);
        Task<Book?> UpdateBookAsync(int id, UpdateBookDTO bookDto, string userId);
        Task<bool> DeleteBookAsync(int id);
        Task<bool> BookHasActiveLoansAsync(int bookId);
    }
}