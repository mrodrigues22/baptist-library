using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Helpers.Loan
{
    public class QueryObject
    {
        public string? SearchTerm { get; set; }

        public int? Status { get; set; }

        public string? UserId { get; set; }

        public string? SortBy { get; set; }

        public bool Descending { get; set; } = false;

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 15;
    }
}