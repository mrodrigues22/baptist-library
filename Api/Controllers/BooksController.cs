using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Library.api.Models;
using System.Security.Claims;
using Library.api.DTOs.Book;
using Library.api.Mappers;

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
                .Where(b => b.Id == id)
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

            // Create the new Book
            var book = new Book
            {
                Title = bookDto.Title,
                Edition = bookDto.Edition,
                PublicationYear = bookDto.PublicationYear,
                Volume = bookDto.Volume,
                PublisherId = publisher.Id,
                QuantityAvailable = bookDto.QuantityAvailable,
                Isbn = bookDto.Isbn,
                Cdd = bookDto.Cdd,
                LibraryLocation = bookDto.LibraryLocation,
                Origin = bookDto.Origin,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now,
                IsActive = true,
                CreatedByUserId = userId
            };

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
    }
}
