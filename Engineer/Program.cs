using System.IO;
using System.Web.Helpers;
using Engineer.Data;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbs"))
);


builder.Services.AddAntiforgery(options =>
{
    // Set Cookie properties using CookieBuilder properties�.
    options.FormFieldName = "AntiforgeryFieldname";
    options.HeaderName = "X-XSRF-TOKEN";
    options.SuppressXFrameOptionsHeader = false;
});


// Cross Origion Resources Sharing bypass for react js 
builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSAllowLocalHost3000",
      builder =>
      builder.WithOrigins("https://localhost:44461")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
     );
});


builder.Services.AddControllers(options =>
{
    options.RespectBrowserAcceptHeader = true;
});

// authentication middleware


// Custom middlewate to overcome FETCH ERROR
// builder.Services.AddMvc(options =>
// {
//     options.AllowEmptyInputInBodyModelBinding = true;
//     foreach (var formatter in options.InputFormatters)
//     {
//         if (formatter.GetType() == typeof(SystemTextJsonInputFormatter))
//             ((SystemTextJsonInputFormatter)formatter).SupportedMediaTypes.Add(
//             Microsoft.Net.Http.Headers.MediaTypeHeaderValue.Parse("text/plain"));
//     }
// }).AddJsonOptions(options =>
// {
//     options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
// });

// authorization middleware

byte[] secretKey = System.Text.Encoding.UTF8.GetBytes("my top secret key");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secretKey),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();



// anti fogery token assignement
var antiforgery = app.Services.GetRequiredService<IAntiforgery>();


app.Use((context, next) =>
{
    var requestPath = context.Request.Path.Value;
        var tokenSet = antiforgery.GetAndStoreTokens(context);
        context.Response.Cookies.Append("XSRF-TOKEN", tokenSet.RequestToken!,
            new CookieOptions {HttpOnly = false ,
                            Secure=false,
                            IsEssential=true,
                            SameSite=SameSiteMode.Strict });

    return next(context);
});


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("CORSAllowLocalHost3000");

app.UseDefaultFiles();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();