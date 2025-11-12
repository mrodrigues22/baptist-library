using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Helpers;
using Api.Helpers.Book;
using Api.Interfaces;
using Library.Api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Repository
{
    public class BookRepository : IBookRepository
    {
        private readonly ApplicationDbContext _context;

        public BookRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Book>> GetAllActiveBooksAsync(QueryObject queryObject)
        {
            var books = _context.Books
                .Where(b => b.IsActive)
                .Include(b => b.Publisher)
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .Include(b => b.BookTags)
                    .ThenInclude(bt => bt.TagWord)
                .AsSplitQuery()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(queryObject.SearchTerm))
            {
                var tokens = queryObject.SearchTerm.Trim().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                foreach (var token in tokens)
                {
                    var pattern = $"%{token}%";
                    books = books.Where(b =>
                        EF.Functions.ILike(ApplicationDbContext.Unaccent(b.Title), pattern) ||
                        EF.Functions.ILike(ApplicationDbContext.Unaccent(b.Isbn), pattern) ||
                        EF.Functions.ILike(ApplicationDbContext.Unaccent(b.Publisher.Name), pattern) ||
                        EF.Functions.ILike(ApplicationDbContext.Unaccent(b.Cdd), pattern) ||
                        b.BookAuthors.Any(ba => EF.Functions.ILike(ApplicationDbContext.Unaccent(ba.Author.FullName), pattern)) ||
                        b.BookTags.Any(bt => EF.Functions.ILike(ApplicationDbContext.Unaccent(bt.TagWord.Word), pattern))
                    );
                }
            }
            if (queryObject.CategoryId.HasValue)
            {
                books = books.Where(b => b.BookCategories.Any(bc => bc.GenreId == queryObject.CategoryId.Value));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.SortBy))
            {
                if (queryObject.SortBy.Equals("title", StringComparison.OrdinalIgnoreCase))
                {
                    books = queryObject.Descending ? books.OrderByDescending(b => b.Title) : books.OrderBy(b => b.Title);
                }
                else if (queryObject.SortBy.Equals("author", StringComparison.OrdinalIgnoreCase))
                {
                    books = queryObject.Descending ?
                        books.OrderByDescending(b => b.BookAuthors.Min(ba => ba.Author.FullName)) :
                        books.OrderBy(b => b.BookAuthors.Min(ba => ba.Author.FullName));
                }
                else if (queryObject.SortBy.Equals("publisher", StringComparison.OrdinalIgnoreCase))
                {
                    books = queryObject.Descending ? books.OrderByDescending(b => b.Publisher.Name) : books.OrderBy(b => b.Publisher.Name);
                }
                else if (queryObject.SortBy.Equals("publicationYear", StringComparison.OrdinalIgnoreCase))
                {
                    books = queryObject.Descending ? books.OrderByDescending(b => b.PublicationYear) : books.OrderBy(b => b.PublicationYear);
                }
                else
                {
                    books = books.OrderBy(b => b.Title);
                }
            }
            else
            {
                books = books.OrderBy(b => b.Title);
            }
            
            int skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            int pageSize = Math.Min(queryObject.PageSize, 15);
            books = books.Skip(skip).Take(pageSize);

            return await books.ToListAsync();
        }

        public async Task<Book?> GetActiveBookByIdAsync(int id)
        {
            return await _context.Books
                .Include(b => b.Publisher)
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .Include(b => b.BookCategories)
                    .ThenInclude(bc => bc.Category)
                .Include(b => b.BookTags)
                    .ThenInclude(bt => bt.TagWord)
                .Include(b => b.CreatedByUser)
                .Include(b => b.ModifiedByUser)
                .Where(b => b.Id == id && b.IsActive)
                .FirstOrDefaultAsync();
        }

        public async Task<Book> CreateBookAsync(Book book, List<string> authorNames, List<string> tagWords, List<string> categories)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Process Authors
            await ProcessAuthorsAsync(book.Id, authorNames);

            // Process Tag Words
            await ProcessTagWordsAsync(book.Id, tagWords);

            // Process Categories
            await ProcessCategoriesAsync(book.Id, categories);

            await _context.SaveChangesAsync();

            return book;
        }

        public async Task<Book?> UpdateBookAsync(int id, Book updatedBook, List<string> authorNames, List<string> tagWords, List<string> categories)
        {
            // Find the existing book
            var existingBook = await _context.Books
                .Include(b => b.BookAuthors)
                .Include(b => b.BookTags)
                .Include(b => b.BookCategories)
                .FirstOrDefaultAsync(b => b.Id == id && b.IsActive);

            if (existingBook == null)
            {
                return null;
            }

            // Update book properties
            existingBook.Title = updatedBook.Title;
            existingBook.Edition = updatedBook.Edition;
            existingBook.PublisherId = updatedBook.PublisherId;
            existingBook.PublicationYear = updatedBook.PublicationYear;
            existingBook.Volume = updatedBook.Volume;
            existingBook.QuantityAvailable = updatedBook.QuantityAvailable;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.Cdd = updatedBook.Cdd;
            existingBook.LibraryLocation = updatedBook.LibraryLocation;
            existingBook.Origin = updatedBook.Origin;
            existingBook.ModifiedDate = updatedBook.ModifiedDate;
            existingBook.ModifiedByUserId = updatedBook.ModifiedByUserId;

            // Update Authors - remove old ones and add new ones
            _context.BookAuthors.RemoveRange(existingBook.BookAuthors);
            await ProcessAuthorsAsync(existingBook.Id, authorNames);

            // Update Tag Words - remove old ones and add new ones
            _context.BookTags.RemoveRange(existingBook.BookTags);
            await ProcessTagWordsAsync(existingBook.Id, tagWords);

            // Update Categories - remove old ones and add new ones
            _context.BookCategories.RemoveRange(existingBook.BookCategories);
            await ProcessCategoriesAsync(existingBook.Id, categories);

            await _context.SaveChangesAsync();

            return existingBook;
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return false;
            }

            book.IsActive = false;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> BookHasActiveLoansAsync(int bookId)
        {
            return await _context.Loans
                .Where(l => l.BookId == bookId)
                .AnyAsync(l => l.Status.Id == 1 || l.Status.Id == 2 || l.Status.Id == 5);
        }

        public async Task<Publisher> GetOrCreatePublisherAsync(string publisherName)
        {
            var publisher = await _context.Publishers
                .FirstOrDefaultAsync(p => p.Name.ToLower() == publisherName.ToLower());
            
            if (publisher == null)
            {
                publisher = new Publisher 
                { 
                    Name = publisherName, 
                    IsActive = true 
                };
                _context.Publishers.Add(publisher);
                await _context.SaveChangesAsync();
            }

            return publisher;
        }

        private async Task ProcessAuthorsAsync(int bookId, List<string> authorNames)
        {
            var names = authorNames
                .Where(n => !string.IsNullOrWhiteSpace(n))
                .Select(n => n.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var authorName in names)
            {
                var author = await _context.Authors
                    .FirstOrDefaultAsync(a => a.FullName.ToLower() == authorName.ToLower());
                if (author == null)
                {
                    author = new Author
                    {
                        FullName = authorName,
                        IsActive = true
                    };
                    _context.Authors.Add(author);
                    await _context.SaveChangesAsync();
                }
                _context.BookAuthors.Add(new BookAuthor { BookId = bookId, AuthorId = author.Id });
            }
        }

        private async Task ProcessTagWordsAsync(int bookId, List<string> tagWords)
        {
            var words = tagWords
                .Where(t => !string.IsNullOrWhiteSpace(t))
                .Select(t => t.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var tagWord in words)
            {
                var tag = await _context.TagWords
                    .FirstOrDefaultAsync(t => t.Word.ToLower() == tagWord.ToLower());
                if (tag == null)
                {
                    tag = new TagWord
                    {
                        Word = tagWord,
                        IsActive = true
                    };
                    _context.TagWords.Add(tag);
                    await _context.SaveChangesAsync();
                }
                _context.BookTags.Add(new BookTag { BookId = bookId, TagWordId = tag.Id });
            }
        }

        private async Task ProcessCategoriesAsync(int bookId, List<string> categoryNames)
        {
            var names = categoryNames
                .Where(g => !string.IsNullOrWhiteSpace(g))
                .Select(g => g.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var categoryName in names)
            {
                var category = await _context.Categories
                    .FirstOrDefaultAsync(g => g.Description.ToLower() == categoryName.ToLower());
                if (category == null)
                {
                    category = new Category
                    {
                        Description = categoryName,
                        IsActive = true
                    };
                    _context.Categories.Add(category);
                    await _context.SaveChangesAsync();
                }
                _context.BookCategories.Add(new BookCategory { BookId = bookId, GenreId = category.Id });
            }
        }
    }
}