using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Helpers;
using Library.Api.Models;

namespace Api.Interfaces
{
    public interface IBookRepository
    {
        Task<List<Book>> GetAllActiveBooksAsync(QueryObject queryObject);
        Task<Book?> GetActiveBookByIdAsync(int id);
        Task<Book> CreateBookAsync(Book book, List<string> authorNames, List<string> tagWords, List<string> categories);
        Task<Book?> UpdateBookAsync(int id, Book book, List<string> authorNames, List<string> tagWords, List<string> categories);
        Task<bool> DeleteBookAsync(int id);
        Task<bool> BookHasActiveLoansAsync(int bookId);
        Task<Publisher> GetOrCreatePublisherAsync(string publisherName);
    }
}