using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Helpers
{
    public class QueryObject
    {
        public string? SearchTerm { get; set; }

        public int? CategoryId { get; set; }

        public string? SortBy { get; set; }

        public bool IsDescending { get; set; } = false;
    }
}