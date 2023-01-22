using Engineer.Models;
using Microsoft.EntityFrameworkCore;

namespace Engineer.Data
{
    public class AuthDbContext: DbContext
    {
        public AuthDbContext(DbContextOptions options): base(options) { }
        public DbSet<User> Users { get; set; }
    }
}
