using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
    }
}
