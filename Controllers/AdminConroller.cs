using Microsoft.AspNetCore.Mvc;
using Engineer.Data;
using Engineer.Decorators;
using Microsoft.AspNetCore.Authorization;

namespace Engineer.Controllers
{
    [Route("admin")]
    [ApiController]
    public class AdminConroller : ControllerBase
    {

        public AuthDbContext _context;
        public AdminConroller(AuthDbContext content)
        {
            this._context = content;
        }

        // here some issues just wouldn't work 
        // so until and unless there is something really critical that I need to secure 

        [HttpGet]
        [Route("AdminUsers")]
        [CSRF]
        [Authorize]
        public IActionResult TestRoute(){
            var User = _context.Users.OrderByDescending(p => p.DateCreated).Take(10).ToList();
            return new JsonResult(Ok(User));
        }

    }
}
