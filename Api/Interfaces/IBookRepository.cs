using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Helpers;
using Api.Helpers.Book;
using Library.Api.Models;

namespace Api.Interfaces
{
    public interface IBookRepository
    {
        Task<List<Book>> GetAllActiveBooksAsync(QueryObject queryObject, CancellationToken cancellationToken = default);
        Task<PagedResult<Book>> GetPagedActiveBooksAsync(QueryObject queryObject, CancellationToken cancellationToken = default);
        Task<Book?> GetActiveBookAsync(int id, CancellationToken cancellationToken = default);
        Task<Book> CreateBookAsync(Book book, List<string> authorNames, List<string> tagWords, List<string> categories, CancellationToken cancellationToken = default);
        Task<Book?> UpdateBookAsync(int id, Book book, List<string> authorNames, List<string> tagWords, List<string> categories, CancellationToken cancellationToken = default);
        Task<bool> DeleteBookAsync(int id, CancellationToken cancellationToken = default);
        Task<bool> BookHasActiveLoansAsync(int bookId, CancellationToken cancellationToken = default);
        Task<Publisher> GetOrCreatePublisherAsync(string publisherName, CancellationToken cancellationToken = default);
    }
}