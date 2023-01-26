using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace Engineer.Helper
{
    public static class Tool
    {
        public static void ValidateJWT(string? token, out bool status)
        {
            string? JwtToken = null;
            if (token == null)
            {
                status = false;
            }
            else
            {
                string[]? ActualToken = token.Split(" ");
                if (ActualToken.Length == 2)
                {
                    int c = 0;
                    foreach (var i in ActualToken)
                    {
                        if (c == 1)
                        {
                            JwtToken = i;
                        }
                        c++;
                    }
                }
            }
            if (JwtToken != null)
            {
                byte[] secretKey = System.Text.Encoding.UTF8.GetBytes("my top secret key");
                var tokenHandler = new JwtSecurityTokenHandler();
                try
                {
                    tokenHandler.ValidateToken(JwtToken, new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ClockSkew = TimeSpan.Zero
                    }, out SecurityToken validatedToken);
                    status = true;
                }
                catch
                {
                    status = false;
                }
            }
            else
            {
                status = false;
            }
        }
    }
}