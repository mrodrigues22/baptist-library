using Library.Api.DTOs.Book;
using Library.Api.Models;

namespace Library.Api.Mappers
{
    public static class BookMappers
    {
        public static BookDTO ToBookDTO(this Book book)
        {
            return new BookDTO
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

        public static BookDTO ToBookDTO(this Book book, string currentUserId)
        {
            var dto = book.ToBookDTO();
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

        public static BooksDTO ToBooksDTO(this Book book)
        {
            return new BooksDTO
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
        
        public static BooksDTO ToBooksDTO(this Book book, string currentUserId)
        {
            var borrowedByCurrentUser = book.Loans.Any(l => (l.Status.Id == 1 || l.Status.Id == 2) && l.RequesterUserId == currentUserId);
            return new BooksDTO
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

        public static Book ToBookFromCreateDTO(this CreateBookDTO createBookDTO)
        {
            return new Book
            {
                Title = createBookDTO.Title,
                Edition = createBookDTO.Edition,
                PublicationYear = createBookDTO.PublicationYear,
                Volume = createBookDTO.Volume,
                QuantityAvailable = createBookDTO.QuantityAvailable,
                Isbn = createBookDTO.Isbn,
                Cdd = createBookDTO.Cdd,
                LibraryLocation = createBookDTO.LibraryLocation,
                Origin = createBookDTO.Origin,
                IsActive = true
            };
        }

        public static void UpdateBookFromDTO(this Book book, UpdateBookDTO updateBookDTO)
        {
            book.Title = updateBookDTO.Title;
            book.Edition = updateBookDTO.Edition;
            book.PublicationYear = updateBookDTO.PublicationYear;
            book.Volume = updateBookDTO.Volume;
            book.QuantityAvailable = updateBookDTO.QuantityAvailable;
            book.Isbn = updateBookDTO.Isbn;
            book.Cdd = updateBookDTO.Cdd;
            book.LibraryLocation = updateBookDTO.LibraryLocation;
            book.Origin = updateBookDTO.Origin;
        }
    }
}