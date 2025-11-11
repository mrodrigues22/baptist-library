using Library.api.DTOs.Book;
using Library.api.Models;

namespace Library.api.Mappers
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
    }
}