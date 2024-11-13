using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using CodeClass.BusinessLogic.Models;
using CodeClass.Domain.Identity;
using CodeClass.Domain.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CodeClass.BusinessLogic.Services.Authentication;

public class AuthenticationService : IAuthenticationService
{
    private readonly IdentityUserManager _userManager;
    private readonly IConfiguration _configuration;

    public AuthenticationService(IdentityUserManager userManager, IConfiguration confguration)
    {
        _configuration = confguration;
        _userManager = userManager;
    }

    public async Task<IdentityResult> UserSignup(SignupData data)
    {
        var user = new UserData
        {
            UserName = data.UserName,
            Email = data.Email,
            FirstName = data.FirstName,
            LastName = data.LastName,
            DisplayName = $"{data.FirstName} {data.LastName}"
        };

        var result = await _userManager.CreateAsync(user, data.Password);
        
        if (result.Succeeded)
        {
            var roleResult = await _userManager.AddToRoleAsync(user, data.Role);
            if (!roleResult.Succeeded)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "RoleAssignmentFailed",
                    Description = JsonSerializer.Serialize(roleResult.Errors)
                });
            }
            return IdentityResult.Success;
        }

        return IdentityResult.Failed(new IdentityError
        {
            Code = "SignupFailed",
            Description = JsonSerializer.Serialize(result.Errors)
        });
    }

    public async Task<IdentityResult> UserLogin(LoginData data)
    {
        var user = await _userManager.FindByEmailAsync(data.Email);

        if (user != null && await _userManager.CheckPasswordAsync(user, data.Password))
        {
            return IdentityResult.Success;
        }


        return IdentityResult.Failed(new IdentityError
        {
            Code = "LoginFailed",
            Description = "Invalid Credentials"
        });
    }

    public string GenerateJwtToken(string email)
    {
        UserData user = _userManager.FindByEmailAsync(email).Result;

        var role = "Student"; // temporary role

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

        SigningCredentials signingCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512Signature);

        var secuirtyToken = new JwtSecurityToken(
            claims: new List<Claim>
            {
                new Claim(ClaimTypes.Role, role),
                new Claim("Id", user.Id),
            },
            expires: DateTime.Now.AddDays(1),
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            signingCredentials: signingCred);

        var token = new JwtSecurityTokenHandler().WriteToken(secuirtyToken);

        return token;
    }

    public async Task<Profile> GetUser(ClaimsPrincipal userPrincipal)
    {
        var userId = userPrincipal.FindFirst("Id")?.Value;

        if (userId == null)
        {
            throw new Exception("User ID claim not found in token.");
        }

        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
        {
            throw new Exception("User not found.");
        }

        var roles = await _userManager.GetRolesAsync(user);
        
        return new Profile
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            Role = roles.FirstOrDefault() ?? string.Empty,
            UserName = user.UserName ?? string.Empty,
            DisplayName = user.DisplayName
        };
    }
}