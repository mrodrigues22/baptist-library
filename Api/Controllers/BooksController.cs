using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Library.Api.Models;
using System.Security.Claims;
using Library.Api.DTOs.Book;
using Library.Api.Mappers;

namespace Api.Controllers
{
    [Route("api/books")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context; 
        public BooksController(ApplicationDbContext context) {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetBooks()
        {
            List<int> statusIds = new List<int> { 1, 2, 5 };
            var books = _context.Books
                .Where(b => b.IsActive)
                .Include(b => b.Publisher)
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .ToList()
                .Select(b => b.ToBooksDTO());
            return Ok(books);
        }
        
        [HttpGet("{id}")]
        public IActionResult GetBook(int id)
        {
            List<int> statusIds = new List<int> { 1, 2, 5 };
            var book = _context.Books
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
                .Select(b => b.ToBookDTO())
                .FirstOrDefault();
            
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        // POST: api/books
        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] CreateBookDTO bookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to create a book.");
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

            // Create the new Book using mapper
            var book = bookDto.ToBookFromCreateDTO();
            book.PublisherId = publisher.Id;
            book.CreatedDate = DateTime.Now;
            book.ModifiedDate = DateTime.Now;
            book.CreatedByUserId = userId;

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Process Authors
            var authorNames = bookDto.AuthorNames
                .Where(n => !string.IsNullOrWhiteSpace(n))
                .Select(n => n.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var authorName in authorNames)
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
                _context.BookAuthors.Add(new BookAuthor { BookId = book.Id, AuthorId = author.Id });
            }

            // Process Tag Words
            var tagWords = bookDto.TagWords
                .Where(t => !string.IsNullOrWhiteSpace(t))
                .Select(t => t.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var tagWord in tagWords)
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
                _context.BookTags.Add(new BookTag { BookId = book.Id, TagWordId = tag.Id });
            }

            // Process Categories
            var categoryNames = bookDto.Categories
                .Where(g => !string.IsNullOrWhiteSpace(g))
                .Select(g => g.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var categoryName in categoryNames)
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
                _context.BookCategories.Add(new BookCategory { BookId = book.Id, GenreId = category.Id });
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, new { id = book.Id, message = "Book created successfully" });
        }

        // PUT: api/books/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] UpdateBookDTO bookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to update a book.");
            }

            // Find the existing book
            var book = await _context.Books
                .Include(b => b.BookAuthors)
                .Include(b => b.BookTags)
                .Include(b => b.BookCategories)
                .FirstOrDefaultAsync(b => b.Id == id && b.IsActive);

            if (book == null)
            {
                return NotFound($"Book with ID {id} not found.");
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
            book.ModifiedDate = DateTime.Now;
            book.ModifiedByUserId = userId;

            // Update Authors - remove old ones and add new ones
            _context.BookAuthors.RemoveRange(book.BookAuthors);
            
            var authorNames = bookDto.AuthorNames
                .Where(n => !string.IsNullOrWhiteSpace(n))
                .Select(n => n.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var authorName in authorNames)
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
                _context.BookAuthors.Add(new BookAuthor { BookId = book.Id, AuthorId = author.Id });
            }

            // Update Tag Words - remove old ones and add new ones
            _context.BookTags.RemoveRange(book.BookTags);
            
            var tagWords = bookDto.TagWords
                .Where(t => !string.IsNullOrWhiteSpace(t))
                .Select(t => t.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var tagWord in tagWords)
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
                _context.BookTags.Add(new BookTag { BookId = book.Id, TagWordId = tag.Id });
            }

            // Update Categories - remove old ones and add new ones
            _context.BookCategories.RemoveRange(book.BookCategories);
            
            var categoryNames = bookDto.Categories
                .Where(g => !string.IsNullOrWhiteSpace(g))
                .Select(g => g.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var categoryName in categoryNames)
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
                _context.BookCategories.Add(new BookCategory { BookId = book.Id, GenreId = category.Id });
            }

            await _context.SaveChangesAsync();

            return Ok(new { id = book.Id, message = "Book updated successfully" });
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to delete a book.");
            }

            var book = await _context.Books
                .Include(b => b.BookAuthors)
                .Include(b => b.BookTags)
                .Include(b => b.BookCategories)
                .Include(b => b.Loans)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            // Check if book has active loans
            var hasActiveLoans = book.Loans.Any(l => l.Status.Id == 1 || l.Status.Id == 2 || l.Status.Id == 5);
            if (hasActiveLoans)
            {
                return BadRequest("Cannot delete book with active loans.");
            }

            book.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
