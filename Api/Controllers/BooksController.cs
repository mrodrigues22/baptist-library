using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Library.Api.Models;
using System.Security.Claims;
using Library.Api.DTOs.Book;
using Library.Api.Mappers;
using Api.Interfaces;

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
        public async Task<IActionResult> GetBooks()
        {
            var books = await _bookRepository.GetAllActiveBooksAsync();
            var booksDto = books.Select(b => b.ToBooksDTO());
            return Ok(booksDto);
        }
        
        [HttpGet("{id}")]
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

            var book = await _bookRepository.CreateBookAsync(bookDto, userId);

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

            var book = await _bookRepository.UpdateBookAsync(id, bookDto, userId);

            if (book == null)
            {
                return NotFound($"Book with ID {id} not found.");
            }

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
