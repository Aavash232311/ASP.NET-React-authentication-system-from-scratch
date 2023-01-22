using Microsoft.AspNetCore.Mvc;
using Engineer.Models;
using System.Web.Helpers;
using MimeKit;
using MailKit.Security;
using MimeKit.Text;
using MailKit.Net.Smtp;
using System.Security.Cryptography;
using System;
using Engineer.Data;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Utilities;
using System.Security.Claims;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Engineer.Controllers
{

    public class Login
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UserRequestHdneler
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string Username { get; set; }
        public string ConformPaaword { get; set; }
    }

    public class UserResponseRegister
    {
        public string Email { get; set; } = string.Empty;
    }

    public class RefreshToken
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.Now;
        public DateTime BlackListDate { get; set; } = DateTime.Now;
    }


    [Produces("application/json")]
    [ApiController]
    [Route("[controller]")]

    public class ItemController : ControllerBase
    {
        private AuthDbContext _context;
        public ItemController(AuthDbContext context)
        {
            this._context = context;
        }

        private void HashingAlgorithm(string password, out byte[] passowrdHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passowrdHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        [HttpPost]
         [ValidateAntiForgeryToken]
        [Consumes("application/json")]
        public async Task<IActionResult> Post(UserRequestHdneler model)
        {
            Validator(model.Password, out bool status, out List<string> message);
            if (model.Password != model.ConformPaaword)
            {
                status = false;
                message.Add("The two password field did not matched");
            }

            if (status == false)
            {
                return new JsonResult(NotFound(message));
            }
            var UserExists = _context.Users.Where(x => x.Username == model.Username || x.Email == model.Email).FirstOrDefault();
            if (UserExists != null)
            {
                return new JsonResult(BadRequest("User already exists"));
            }

            HashingAlgorithm(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
            Random module = new Random();
            int code = module.Next(1000, 9999);
            Guid userId = new Guid();
            User newUser = new User()
            {
                Id = userId,
                Password = passwordHash,
                Salt = passwordSalt,
                Address = model.Address,
                Email = model.Email,
                Username = model.Username,
                IsActive = false,
                Name = model.Name,
                OnTimePassword = code,
                JoinedDate = DateTime.Now,
                RefreshToken = string.Empty
            };

            var res = new UserResponseRegister()
            {
                Email = model.Email
            };

         /*   await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();*/


            //    var email = new MimeMessage();
            //     email.From.Add(MailboxAddress.Parse("aavash3150@gmail.com"));
            //     email.To.Add(MailboxAddress.Parse(model.Email));
            //     email.Subject = "Email verification";
            //     email.Body = new TextPart(TextFormat.Html)
            //     {
            //         Text = $"Hi we would like to comform your login your code is: {code}"
            //     };

            //     using var smtp = new SmtpClient();
            //     smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            //     smtp.Authenticate("aavash3150@gmail.com", "");
            //     smtp.Send(email);
            //     smtp.Disconnect(true);
            return new JsonResult(Ok(res));
        }

        [HttpPost]
         [ValidateAntiForgeryToken]
        [Route("login")]
        public async Task<IActionResult> Post(Login cred)
        {
            string username = cred.Username;
            var user = _context.Users.Where(x => x.Username == username).FirstOrDefault();
            if (user == null)
            {
                return new JsonResult(BadRequest("Username or password is incorrect"));
            }

            bool isAuthenticated = Authenticate(cred.Password, user.Password, user.Salt);

            if (isAuthenticated == false)
            {
                return new JsonResult(BadRequest("Username or password is incorrect"));
            }

            var resp = new HttpResponseMessage();


            string assignJwt = CreateToken(user);
            // random token with assign and expirey date
            var refreshToken = GenerateToken();
            // assign token to http only cookie and save it in user record
            AssignHttpOnlyCookie(refreshToken, out RefreshToken RefreshTokenInfo);
            user.RefreshToken = RefreshTokenInfo.Token;
            user.DateCreated = RefreshTokenInfo.Date;
            user.DateExpires = RefreshTokenInfo.BlackListDate;

            await _context.SaveChangesAsync();
            return new JsonResult(Ok(assignJwt));
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, "normal client")
            };
            byte[] secretKey = System.Text.Encoding.UTF8.GetBytes("my top secret key");
            var key = new SymmetricSecurityKey(secretKey);

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private bool Authenticate(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        static private void Validator(string password, out bool status, out List<string> message)
        {
            int PasswordLength = password.Length;

            List<string> errors = new List<string>();
            bool Stat = true;

            if (password.Length <= 8)
            {
                Stat = false;
                errors.Add("Password must be minium 8 characters");
            }

            if (password.Length >= 25)
            {
                Stat = false;
                errors.Add("Password must be maximum 25 characters");
            }


            int AllInt = 0;
            int AllStr = 0;

            for (int i = 0; i < PasswordLength; i++)
            {
                try
                {
                    int.Parse(password[i].ToString());
                    AllInt++;
                }
                catch (Exception)
                {
                    AllStr++;
                }

            }
            if (AllInt == PasswordLength)
            {
                errors.Add("Password must not contain only numbers");
                Stat = false;
            }
            if (AllStr == PasswordLength)
            {
                errors.Add("Password must not contaion only alphabets");
                Stat = false;
            }

            status = Stat;
            message = errors;
        }

        private RefreshToken GenerateToken()
        {
            // random 64 character string and token assign date as well as expirey date 
            var token = new RefreshToken()
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                BlackListDate = DateTime.Now.AddDays(2),
                Date = DateTime.Now,
            };
            return token;
        }

        private void AssignHttpOnlyCookie(RefreshToken tokenObject, out RefreshToken token)
        {
            // assigning it into http only cookie

            Response.Cookies.Append("refreshToken", tokenObject.Token, new CookieOptions()
            {
                HttpOnly = true,
                Expires = tokenObject.BlackListDate,
                Domain = "localhost",
                IsEssential = true,
            });
            token = tokenObject;
        }

        [HttpGet]
        [Route("RefreshToken")]
        [Authorize]
        public async Task<IActionResult> WhiteListToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            Console.WriteLine("Cookie NOT WORKING" + refreshToken);
            var User = _context.Users.Where(x => x.RefreshToken == refreshToken).FirstOrDefault();
            if (User == null)
            {
                Console.WriteLine("NULL " + refreshToken);
                return Unauthorized("Illegal request made");
            }
            if (!User.RefreshToken.Equals(refreshToken))
            {
                return Unauthorized("Illegal request made");
            }
            else if (User.DateExpires < DateTime.Now)
            {
                return Unauthorized("Token expired.");
            }

            string accessToken = CreateToken(User);
            // random token with assign and expirey date
            var newRefreshToken = GenerateToken();


            // assign token to http only cookie and save it in user record
            AssignHttpOnlyCookie(newRefreshToken, out RefreshToken RefreshTokenInfo);
            User.RefreshToken = RefreshTokenInfo.Token;
            User.DateCreated = RefreshTokenInfo.Date;
            User.DateExpires = RefreshTokenInfo.BlackListDate;

            await _context.SaveChangesAsync();
            return new JsonResult(Ok(accessToken));
        }

        [HttpGet]
        [Route("Init")]
        public IActionResult Initial()
        {
            return Ok();
        }
    }
}