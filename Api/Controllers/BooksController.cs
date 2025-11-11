using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Library.DTOs;

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
                .Select(b => new BooksDTO
                {
                    Id = b.Id,
                    Title = b.Title,
                    Edition = b.Edition,
                    Publisher = b.Publisher.Name,
                    PublicationYear = b.PublicationYear,
                    Authors = b.BookAuthors.Select(ba => ba.Author.FullName).ToList(),
                    AvailableCopies = b.QuantityAvailable - b.Loans.Count(l => statusIds.Contains(l.StatusId))
                })
                .ToList();
            return Ok(books);
        }
        
        [HttpGet("{id}")]
        public IActionResult GetBook(int id)
        {
            var book = _context.Books
                .Include(b => b.Publisher)
                .Include(b => b.BookAuthors)
                    .ThenInclude(ba => ba.Author)
                .Include(b => b.BookCategories)
                    .ThenInclude(bc => bc.Category)
                .Include(b => b.BookTags)
                    .ThenInclude(bt => bt.TagWord)
                .Where(b => b.Id == id).FirstOrDefault();
            
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }
    }
}
