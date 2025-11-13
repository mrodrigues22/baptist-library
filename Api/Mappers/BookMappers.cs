using Library.Api.DTOs.Book;
using Library.Api.Models;

namespace Library.Api.Mappers
{
    public static class BookMappers
    {
        public static BookDetailDto ToBookDetailDto(this Book book)
        {
            return new BookDetailDto
            {
                Id = book.Id,
                Title = book.Title,
                Edition = book.Edition,
                Publisher = book.Publisher.Name,
                PublicationYear = book.PublicationYear,
                Volume = book.Volume,
                Isbn = book.Isbn,
                Cdd = book.Cdd,
                LibraryLocation = book.LibraryLocation,
                Quantity = book.QuantityAvailable,
                AvailableCopies = book.QuantityAvailable - book.Loans.Count(l => l.Status.Id == 1 || l.Status.Id == 2 || l.Status.Id == 5),
                Origin = book.Origin,
                Authors = book.BookAuthors.Select(ba => ba.Author.FullName).ToList(),
                Categories = book.BookCategories.Select(bc => bc.Category.Description).ToList(),
                Tags = book.BookTags.Select(bt => bt.TagWord.Word).ToList(),
                CreatedByUser = book.CreatedByUser?.UserName,
                CreatedDate = book.CreatedDate,
                ModifiedByUser = book.ModifiedByUser?.UserName,
                ModifiedDate = book.ModifiedDate
            };
        }

        public static BookDetailDto ToBookDetailDto(this Book book, string currentUserId)
        {
            var dto = book.ToBookDetailDto();
            if (!string.IsNullOrEmpty(currentUserId) && book.Loans != null)
            {
                dto.BorrowedByCurrentUser = book.Loans.Any(l => (l.Status.Id == 1 || l.Status.Id == 2) && l.RequesterUserId == currentUserId);
            }
            else
            {
                dto.BorrowedByCurrentUser = false;
            }
            return dto;
        }

        public static BookSummaryDto ToBookSummaryDto(this Book book)
        {
            return new BookSummaryDto
            {
                Id = book.Id,
                Title = book.Title,
                Edition = book.Edition,
                Publisher = book.Publisher.Name,
                PublicationYear = book.PublicationYear,
                AvailableCopies = book.QuantityAvailable - book.Loans.Count(l => l.Status.Id == 1 || l.Status.Id == 2 || l.Status.Id == 5),
                Authors = book.BookAuthors.Select(ba => ba.Author.FullName).ToList()
            };
        }
        
        public static BookSummaryDto ToBookSummaryDto(this Book book, string currentUserId)
        {
            var borrowedByCurrentUser = book.Loans.Any(l => (l.Status.Id == 1 || l.Status.Id == 2) && l.RequesterUserId == currentUserId);
            return new BookSummaryDto
            {
                Id = book.Id,
                Title = book.Title,
                Edition = book.Edition,
                Publisher = book.Publisher.Name,
                PublicationYear = book.PublicationYear,
                AvailableCopies = book.QuantityAvailable - book.Loans.Count(l => l.Status.Id == 1 || l.Status.Id == 2 || l.Status.Id == 5),
                Authors = book.BookAuthors.Select(ba => ba.Author.FullName).ToList(),
                Quantity = book.QuantityAvailable,
                BorrowedByCurrentUser = borrowedByCurrentUser
            };
        }

        public static Book ToBookFromCreateDto(this CreateBookDto createBookDto)
        {
            return new Book
            {
                Title = createBookDto.Title,
                Edition = createBookDto.Edition,
                PublicationYear = createBookDto.PublicationYear,
                Volume = createBookDto.Volume,
                QuantityAvailable = createBookDto.QuantityAvailable,
                Isbn = createBookDto.Isbn,
                Cdd = createBookDto.Cdd,
                LibraryLocation = createBookDto.LibraryLocation,
                Origin = createBookDto.Origin,
                IsActive = true
            };
        }

        public static void UpdateBookFromDto(this Book book, UpdateBookDto updateBookDto)
        {
            book.Title = updateBookDto.Title;
            book.Edition = updateBookDto.Edition;
            book.PublicationYear = updateBookDto.PublicationYear;
            book.Volume = updateBookDto.Volume;
            book.QuantityAvailable = updateBookDto.QuantityAvailable;
            book.Isbn = updateBookDto.Isbn;
            book.Cdd = updateBookDto.Cdd;
            book.LibraryLocation = updateBookDto.LibraryLocation;
            book.Origin = updateBookDto.Origin;
        }
    }
}