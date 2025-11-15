using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Helpers.Book
{
    public class QueryObject
    {
        public string? SearchTerm { get; set; }

        public int? CategoryId { get; set; }

        public string? SortBy { get; set; }

        public bool Descending { get; set; } = false;

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 15;
    }
}