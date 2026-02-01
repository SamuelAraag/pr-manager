using Microsoft.AspNetCore.Mvc;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;

namespace PRManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);
        
        if (result == null)
            return Unauthorized(new { message = "Invalid email or password" });
        
        return Ok(result);
    }

    [HttpPost("admin-login")]
    public async Task<ActionResult<LoginResponseDto>> AdminLogin([FromBody] AdminModeLoginDto adminModeDto)
    {
        var result = await _authService.AdminLoginAsync(adminModeDto);
        
        if (result == null)
            return Unauthorized(new { message = "Invalid secret password" });
        
        return Ok(result);
    }
}
