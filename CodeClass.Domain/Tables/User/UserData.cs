using Microsoft.AspNetCore.Identity;

namespace CodeClass.Domain.User;

public class UserData : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DisplayName { get; set; }
}