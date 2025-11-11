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
                .Select(b => new BookDetailDTO
                {
                    Id = b.Id,
                    Title = b.Title,
                    Edition = b.Edition,
                    Publisher = b.Publisher.Name,
                    PublicationYear = b.PublicationYear,
                    Volume = b.Volume,
                    Isbn = b.Isbn,
                    Cdd = b.Cdd,
                    LibraryLocation = b.LibraryLocation,
                    Quantity = b.QuantityAvailable,
                    AvailableCopies = b.QuantityAvailable - b.Loans.Count(l => statusIds.Contains(l.StatusId)),
                    Origin = b.Origin,
                    Authors = b.BookAuthors.Select(ba => ba.Author.FullName).ToList(),
                    Categories = b.BookCategories.Select(bc => bc.Category.Description).ToList(),
                    Tags = b.BookTags.Select(bt => bt.TagWord.Word).ToList(),
                    CreatedByUser = b.CreatedByUser != null ? b.CreatedByUser.FirstName + " " + b.CreatedByUser.LastName : null,
                    CreatedDate = b.CreatedDate,
                    ModifiedByUser = b.ModifiedByUser != null ? b.ModifiedByUser.FirstName + " " + b.ModifiedByUser.LastName : null,
                    ModifiedDate = b.ModifiedDate
                })
                .FirstOrDefault();
            
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }
    }
}
