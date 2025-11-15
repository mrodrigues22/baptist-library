namespace Api.Helpers.Book
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalTitles { get; set; }
        public int TotalCopies { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public PagedResult()
        {
        }

        public PagedResult(List<T> items, int totalTitles, int totalCopies, int pageNumber, int pageSize)
        {
            Items = items;
            TotalTitles = totalTitles;
            TotalCopies = totalCopies;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}
