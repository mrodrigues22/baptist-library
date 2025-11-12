using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Interfaces;
using Library.Api.Models;
using Library.Api.DTOs.Book;
using Library.Api.Mappers;
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

        public async Task<List<Book>> GetAllActiveBooksAsync()
        {
            return await _context.Books
                .Where(b => b.IsActive)
                .Include(b => b.Publisher)
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .ToListAsync();
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

        public async Task<Book> CreateBookAsync(CreateBookDTO bookDto, string userId)
        {
            // Process Publisher
            var publisher = await _context.Publishers
                .FirstOrDefaultAsync(p => p.Name.ToLower() == bookDto.PublisherName.ToLower());
            if (publisher == null)
            {
                publisher = new Publisher 
                { 
                    Name = bookDto.PublisherName, 
                    IsActive = true 
                };
                _context.Publishers.Add(publisher);
                await _context.SaveChangesAsync();
            }

            // Create the new Book using mapper
            var book = bookDto.ToBookFromCreateDTO();
            book.PublisherId = publisher.Id;
            book.CreatedDate = DateTime.UtcNow;
            book.ModifiedDate = DateTime.UtcNow;
            book.CreatedByUserId = userId;

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Process Authors
            await ProcessAuthorsAsync(book.Id, bookDto.AuthorNames);

            // Process Tag Words
            await ProcessTagWordsAsync(book.Id, bookDto.TagWords);

            // Process Categories
            await ProcessCategoriesAsync(book.Id, bookDto.Categories);

            await _context.SaveChangesAsync();

            return book;
        }

        public async Task<Book?> UpdateBookAsync(int id, UpdateBookDTO bookDto, string userId)
        {
            // Find the existing book
            var book = await _context.Books
                .Include(b => b.BookAuthors)
                .Include(b => b.BookTags)
                .Include(b => b.BookCategories)
                .FirstOrDefaultAsync(b => b.Id == id && b.IsActive);

            if (book == null)
            {
                return null;
            }

            // Process Publisher
            var publisher = await _context.Publishers
                .FirstOrDefaultAsync(p => p.Name.ToLower() == bookDto.PublisherName.ToLower());
            if (publisher == null)
            {
                publisher = new Publisher 
                { 
                    Name = bookDto.PublisherName, 
                    IsActive = true 
                };
                _context.Publishers.Add(publisher);
                await _context.SaveChangesAsync();
            }

            // Update book properties using mapper
            book.UpdateBookFromDTO(bookDto);
            book.PublisherId = publisher.Id;
            book.ModifiedDate = DateTime.UtcNow;
            book.ModifiedByUserId = userId;

            // Update Authors - remove old ones and add new ones
            _context.BookAuthors.RemoveRange(book.BookAuthors);
            await ProcessAuthorsAsync(book.Id, bookDto.AuthorNames);

            // Update Tag Words - remove old ones and add new ones
            _context.BookTags.RemoveRange(book.BookTags);
            await ProcessTagWordsAsync(book.Id, bookDto.TagWords);

            // Update Categories - remove old ones and add new ones
            _context.BookCategories.RemoveRange(book.BookCategories);
            await ProcessCategoriesAsync(book.Id, bookDto.Categories);

            await _context.SaveChangesAsync();

            return book;
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