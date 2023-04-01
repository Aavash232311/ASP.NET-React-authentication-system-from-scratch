using Microsoft.AspNetCore.Mvc;
using Engineer.Models;
using MimeKit;
using MailKit.Security;
using MimeKit.Text;
using MailKit.Net.Smtp;
using System.Security.Cryptography;
using Engineer.Data;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Engineer.Helper;
using Engineer.Decorators;

namespace Engineer.Controllers
{

    public class Login
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ChangePassword
    {
        public string UserId { get; set; } = string.Empty;
        public int Code { get; set; }
        public string Password { get; set; } = string.Empty;
        public string ConformPaaword { get; set; } = string.Empty;
    }

    public class UserRequestHdneler
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string ConformPaaword { get; set; } = string.Empty;
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

    public class DeadLockSelf
    {
        public string Token { get; set; }
        public int action { get; set; }
    }


    [Produces("application/json")]
    [ApiController]
    [Route("[controller]")]

    public class ItemController : ControllerBase
    {
        private AuthDbContext _context;
        private string businessEmail = "aavash3150@gmail.com";
        private string businessEmailAppPassword = "";
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
        [Route("ValidateCsrfTest")]
        [CSRF]
        public IActionResult TestC() {
            var headers = Request.Headers;
            return new JsonResult(Ok());
        }

        [HttpPost]
        [Route("Register")]
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
                RefreshToken = string.Empty,
                SuperUser = false,
                LockToken = "",
                Locked = false
            };

            var res = new UserResponseRegister()
            {
                Email = model.Email
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();
            string emailBody = $"Hi we would like to comform your login your code is: {code}";
            string EmailSub = "Email verification";
            string toSendEmail = model.Email;

            SendEmail(emailBody, EmailSub, toSendEmail);
            return new JsonResult(Ok(res));
        }

        private void SendEmail(string body, string Subject, string UserEmail)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(businessEmail));
            email.To.Add(MailboxAddress.Parse(UserEmail));
            email.Subject = Subject;
            email.Body = new TextPart(TextFormat.Html)
            {
                Text = body
            };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(businessEmail, businessEmailAppPassword);
            smtp.Send(email);
            smtp.Disconnect(true);
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

            if (user.IsActive == false)
            {
                return new JsonResult(BadRequest("Pelase verify your email to continure login"));
            }

            bool isAuthenticated = Authenticate(cred.Password, user.Password, user.Salt);

            if (user.SuperUser == true)
            {
                return new JsonResult(BadRequest("You don't belong here"));
            }

            if (isAuthenticated == false)
            {
                return new JsonResult(BadRequest("Username or password is incorrect"));
            }


            List<Claim> claims = NormClaims(user);

            string assignJwt = CreateToken(user, claims);
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

        private List<Claim> NormClaims(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, "normal client")
            };

            return claims;
        }

        private string CreateToken(User user, List<Claim> claims)
        {
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
        [Route("check")]
        public IActionResult CheckToken()
        {
            Tool.ValidateJWT(Request.Headers["Authorization"], out bool status, out string role);
            return new JsonResult(Ok(status));
        }

        [HttpGet]
        [Route("adminCheck")]
        public IActionResult CheckAdmin()
        {
            // Date and secrect key relataed validataion    
            try
            {
                Tool.ValidateJWT(Request.Headers["Authorization"], out bool status, out string role);
                if (status == true)
                {
                    // if the role is of admin
                    var info = new Dictionary<string, string>(){
                {"Role", role},

            };
                    if (role == "adminstration")
                    {
                        return new JsonResult(info);
                    }
                }
            }
            catch
            {

                return new JsonResult(BadRequest());
            }
            return new JsonResult(BadRequest());
        }

        [HttpGet]
        [Route("RefreshToken")]
        public async Task<IActionResult> WhiteListToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var User = _context.Users.Where(x => x.RefreshToken == refreshToken).FirstOrDefault();
            if (User == null)
            {
                return Ok();
            }
            if (!User.RefreshToken.Equals(refreshToken))
            {
                return Ok();
            }
            else if (User.DateExpires < DateTime.Now)
            {
                return Ok();
            }
            List<Claim> TokenClaimns = NormClaims(User);

            if (User.SuperUser == true)
            {
                TokenClaimns = SuperClaims(User);
            }
            string accessToken = CreateToken(User, TokenClaimns);
            var newRefreshToken = GenerateToken();
            User.RefreshToken = newRefreshToken.Token;
            User.DateCreated = newRefreshToken.Date;
            User.DateExpires = newRefreshToken.BlackListDate;
            AssignHttpOnlyCookie(newRefreshToken, out RefreshToken RefreshTokenInfo);
            await _context.SaveChangesAsync();
            return new JsonResult(Ok(accessToken));
        }

        [HttpGet]
        [Route("Init")]
        public IActionResult Initial()
        {
            return Ok();
        }

        private List<Claim> SuperClaims(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, "adminstration"),
            };

            return claims;
        }

        // # login interval of 2 minutes (brute force attack prevention)
        // # super user check on the database
        // # cookie lifespan is about 5 minutes
        // # refreh token lifespan 30 minutes
        // # if user from email declines it was not me then block login attemt with password reset 



        [HttpPost]
        [Route("AdminLoginPortal")]
        public async Task<IActionResult> AdminPortalLogin(Login cred)
        {
            string Username = cred.Username;
            string Password = cred.Password;
            var user = _context.Users.Where(x => x.Username == Username).FirstOrDefault();
            if (user == null)
            {
                return new JsonResult(BadRequest("403"));
            }
            // if (user.IsActive == false)
            // {
            //     return BadRequest("Newtwork error");
            // }
            if (user.SuperUser == true)
            {
                bool isAuthenticated = Authenticate(Password, user.Password, user.Salt);

                if (isAuthenticated == true)
                {
                    string clientDomain = Tool.ClientDomain();
                    string antiTokenCollision = Convert.ToBase64String(user.Salt);
                    string LockToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(128)) + antiTokenCollision;
                    user.LockToken = LockToken;
                    user.IsActive = false;
                    await _context.SaveChangesAsync();
                    string body = $"Please conform your identity " +
                   $"Check activity at {clientDomain}/secureAccount/?promptCode={LockToken}&userId={user.Username}";
                    string subject = "someone trying to access your adminstration account";
                    SendEmail(body, subject, user.Email);
                    // Lock 
                    return new JsonResult(Ok(isAuthenticated));
                }
                return new JsonResult(BadRequest("Incorrect username or password"));
            }
            return new JsonResult(BadRequest());
        }

        // if I want to change password
        [HttpPost]
        [Route("ChangePasswordRequest")]
        public async Task<IActionResult> ChangePasswordRequest(ReactivateClass Credentials)
        {
            var User = _context.Users.Where(x => x.Username == Credentials.Username &&
            x.LockToken == Credentials.Token).FirstOrDefault();
            if (User == null) return new JsonResult(BadRequest());
            string Subject = "Password reset mail";
            Random module = new Random();
            int code = module.Next(1000, 9999);
            User.OnTimePassword = code;
            await _context.SaveChangesAsync();
            string Body = $"Hi to reset your password your code is {User.OnTimePassword}";
            SendEmail(Body, Subject, User.Email);
            return new JsonResult(Ok());
        }

        [HttpPost]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ResetPasswordModel model)
        {
            var user = _context.Users.Where(x => x.Username == model.Username &&
            x.LockToken == model.LockToken && x.OnTimePassword == model.Code).FirstOrDefault();
            if (user == null) return new JsonResult(BadRequest("Invalid code"));
            Validator(model.Password, out bool status, out List<string> message);
            if (status == false) return new JsonResult(BadRequest(message));
            HashingAlgorithm(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
            user.Password = passwordHash;
            user.Salt = passwordSalt;
            user.IsActive = true;
            user.LockToken = "";
            await _context.SaveChangesAsync();
            return new JsonResult(Ok());
        }

        [HttpPost]
        [Route("AuthenticLogin")]
        public async Task<IActionResult> LgoinAuth(ReactivateClass cred)
        {
            var user = _context.Users.Where(x => x.Username == cred.Username && x.LockToken == cred.Token).FirstOrDefault();
            if (user == null) return new JsonResult(BadRequest("User does not exists"));
            user.IsActive = true;

            List<Claim> claims = SuperClaims(user);
            string assignJwt = CreateToken(user, claims);
            var refreshToken = GenerateToken();
            AssignHttpOnlyCookie(refreshToken, out RefreshToken RefreshTokenInfo);
            user.RefreshToken = RefreshTokenInfo.Token;
            user.DateCreated = RefreshTokenInfo.Date;
            user.DateExpires = RefreshTokenInfo.BlackListDate;

            await _context.SaveChangesAsync();
            return new JsonResult(Ok(assignJwt));
        }
    }
}