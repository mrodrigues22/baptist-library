using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Library.Api.Models;
using System.Security.Claims;
using Library.Api.DTOs.Book;
using Library.Api.Mappers;
using Api.Interfaces;
using Api.Helpers;
using Api.Helpers.Book;

namespace Api.Controllers
{
    [Route("api/books")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookRepository _bookRepository; 
        public BooksController(IBookRepository bookRepository) {
            _bookRepository = bookRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] QueryObject queryObject)
        {
            var books = await _bookRepository.GetAllActiveBooksAsync(queryObject);
            var booksDto = books.Select(b => b.ToBooksDTO());
            return Ok(booksDto);
        }
        
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await _bookRepository.GetActiveBookByIdAsync(id);
            
            if (book == null)
            {
                return NotFound();
            }
            
            var bookDto = book.ToBookDTO();
            return Ok(bookDto);
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

            // Map DTO to Model and handle Publisher
            var book = bookDto.ToBookFromCreateDTO();
            
            // Process Publisher
            var publisher = await _bookRepository.GetOrCreatePublisherAsync(bookDto.PublisherName);
            book.PublisherId = publisher.Id;
            book.CreatedDate = DateTime.UtcNow;
            book.ModifiedDate = DateTime.UtcNow;
            book.CreatedByUserId = userId;

            var createdBook = await _bookRepository.CreateBookAsync(book, bookDto.AuthorNames, bookDto.TagWords, bookDto.Categories);

            return CreatedAtAction(nameof(GetBook), new { id = createdBook.Id }, createdBook.ToBookDTO());
        }

        // PUT: api/books/{id}
        [HttpPut("{id:int}")]
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

            // Map DTO to Model and handle Publisher
            var updatedBook = new Book
            {
                Title = bookDto.Title,
                Edition = bookDto.Edition,
                PublicationYear = bookDto.PublicationYear,
                Volume = bookDto.Volume,
                QuantityAvailable = bookDto.QuantityAvailable,
                Isbn = bookDto.Isbn,
                Cdd = bookDto.Cdd,
                LibraryLocation = bookDto.LibraryLocation,
                Origin = bookDto.Origin,
                ModifiedDate = DateTime.UtcNow,
                ModifiedByUserId = userId
            };

            // Process Publisher
            var publisher = await _bookRepository.GetOrCreatePublisherAsync(bookDto.PublisherName);
            updatedBook.PublisherId = publisher.Id;

            var book = await _bookRepository.UpdateBookAsync(id, updatedBook, bookDto.AuthorNames, bookDto.TagWords, bookDto.Categories);

            if (book == null)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            return Ok(new { id = book.Id, message = "Book updated successfully" });
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to delete a book.");
            }

            // Check if book has active loans
            var hasActiveLoans = await _bookRepository.BookHasActiveLoansAsync(id);
            if (hasActiveLoans)
            {
                return BadRequest("Cannot delete book with active loans.");
            }

            var deleted = await _bookRepository.DeleteBookAsync(id);

            if (!deleted)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            return NoContent();
        }
    }
}
