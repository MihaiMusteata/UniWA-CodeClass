using CodeClass.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CodeClass.Domain;

public class CodeClassContext : IdentityDbContext<UserData>
{
    public CodeClassContext()
    {
    }

    public CodeClassContext(DbContextOptions<CodeClassContext> options) : base(options)
    {
    }

    public DbSet<UserData> Users { get; set; }
}