using System.Security.Claims;
using CodeClass.BusinessLogic.Models;
using CodeClass.Domain.User;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.Authentication;

public interface IAuthenticationService
{
    Task<IdentityResult> UserSignup(SignupData data);
    Task<IdentityResult> UserLogin(LoginData data);
    string GenerateJwtToken(string email);
    Task<Profile> GetUser(ClaimsPrincipal user);
}