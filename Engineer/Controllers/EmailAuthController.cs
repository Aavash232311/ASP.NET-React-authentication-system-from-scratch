using System.Web.Helpers;
using Engineer.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Engineer.Controllers
{

    public class EmailCode
    {
        public string Email { get; set; }
        public int Code { get; set; }
    }

    [Route("email")]
    [ApiController]
    public class EmailAuthController : ControllerBase
    {
        private AuthDbContext _context;
        public EmailAuthController(AuthDbContext context)
        {
            this._context = context;
        }

        [HttpPost]
        [Produces("application/json")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ConfromUserEmail(EmailCode emailBody)
        {
            int code = emailBody.Code;
            string email = emailBody.Email;
            var currentUser = _context.Users.Where(x => x.Email == email).FirstOrDefault();
            if (currentUser.IsActive == false)
            {
                if (code == currentUser.OnTimePassword)
                {
                    currentUser.IsActive = true;
                    await _context.SaveChangesAsync();
                    return Ok(true);
                }
                else
                {
                    return BadRequest(false);
                }
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
