namespace Api.Helpers.Users
{
    public class QueryObject
    {
        public string? Filter { get; set; }
        public bool IncludeInactive { get; set; } = false;
        public bool PendingApprovalOnly { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 15;
        public string SortBy { get; set; } = "FirstName";
    }
}
