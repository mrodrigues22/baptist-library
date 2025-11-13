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
using Microsoft.AspNetCore.Authorization;

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

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBooks([FromQuery] QueryObject queryObject, CancellationToken cancellationToken)
        {
            var userId = GetUserId();
            var result = await _bookRepository.GetPagedActiveBooksAsync(queryObject, cancellationToken);
            var items = result.Items.Select(b => b.ToBookSummaryDto(userId));
            return Ok(new {
                items,
                totalTitles = result.TotalTitles,
                totalCopies = result.TotalCopies,
                pageNumber = result.PageNumber,
                pageSize = result.PageSize
            });
        }
        
        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetBook(int id, CancellationToken cancellationToken)
        {
            var book = await _bookRepository.GetActiveBookAsync(id, cancellationToken);
            
            if (book == null)
            {
                return NotFound();
            }
            
            var userId = GetUserId();
            var bookDto = book.ToBookDetailDto(userId);
            return Ok(bookDto);
        }

        // POST: api/books
        [HttpPost]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateBook([FromBody] CreateBookDto bookDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to create a book.");
            }

            // Map DTO to Model and handle Publisher
            var book = bookDto.ToBookFromCreateDto();
            
            // Process Publisher
            var publisher = await _bookRepository.GetOrCreatePublisherAsync(bookDto.PublisherName, cancellationToken);
            book.PublisherId = publisher.Id;
            book.CreatedDate = DateTime.UtcNow;
            book.ModifiedDate = DateTime.UtcNow;
            book.CreatedByUserId = userId;

            var createdBook = await _bookRepository.CreateBookAsync(book, bookDto.AuthorNames, bookDto.TagWords, bookDto.Categories, cancellationToken);

            return CreatedAtAction(nameof(GetBook), new { id = createdBook.Id }, createdBook.ToBookDetailDto(userId));
        }

        // PUT: api/books/{id}
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] UpdateBookDto bookDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
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
            var publisher = await _bookRepository.GetOrCreatePublisherAsync(bookDto.PublisherName, cancellationToken);
            updatedBook.PublisherId = publisher.Id;

            var book = await _bookRepository.UpdateBookAsync(id, updatedBook, bookDto.AuthorNames, bookDto.TagWords, bookDto.Categories, cancellationToken);

            if (book == null)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            return Ok(book.ToBookDetailDto(userId));
        }

        // DELETE: api/books/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> DeleteBook(int id, CancellationToken cancellationToken)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to delete a book.");
            }

            // Check if book has active loans
            var hasActiveLoans = await _bookRepository.BookHasActiveLoansAsync(id, cancellationToken);
            if (hasActiveLoans)
            {
                return BadRequest("Cannot delete book with active loans.");
            }

            var deleted = await _bookRepository.DeleteBookAsync(id, cancellationToken);

            if (!deleted)
            {
                return NotFound($"Book with ID {id} not found.");
            }

            return NoContent();
        }
    }
}
