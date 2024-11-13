using CodeClass.BusinessLogic.Models;
using CodeClass.BusinessLogic.Services.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthenticationController(IAuthenticationService authenticationService) : ControllerBase
{
    [HttpPost("sign-in")]
    public async Task<IActionResult> Login(LoginData data)
    {
        var result = await authenticationService.UserLogin(data);
        if (result.Succeeded)
        {
            var tokenString = authenticationService.GenerateJwtToken(data.Email);
            Response.Cookies.Append("jwt_access_token", tokenString, new CookieOptions
            {
                HttpOnly = true
            });

            return Ok(new { accessToken = tokenString });
        }

        return new UnauthorizedObjectResult("Login Failed");
    }

    [HttpPost("sign-up")]
    public async Task<IActionResult> Signup(SignupData data)
    {
        var result = await authenticationService.UserSignup(data);
        if (result.Succeeded)
        {
            var tokenString = authenticationService.GenerateJwtToken(data.Email);
            Response.Cookies.Append("jwt_access_token", tokenString, new CookieOptions
            {
                HttpOnly = true
            });

            return Ok(new { accessToken = tokenString });
        }

        return BadRequest("Signup Failed");
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        try
        {
            var user = await authenticationService.GetUser(User);
            return Ok(new { user = user });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}