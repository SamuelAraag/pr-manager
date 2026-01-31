using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;

namespace PRManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "Admin,Gestor")]
public class AutomationConfigController : ControllerBase
{
    private readonly IAutomationConfigService _configService;
    
    public AutomationConfigController(IAutomationConfigService configService)
    {
        _configService = configService;
    }
    
    [HttpGet]
    public async Task<ActionResult<AutomationConfigDto>> Get()
    {
        var config = await _configService.GetConfigAsync();
        return Ok(config);
    }
    
    [HttpPost]
    public async Task<ActionResult<AutomationConfigDto>> Update([FromBody] UpdateAutomationConfigDto dto)
    {
        var config = await _configService.UpdateConfigAsync(dto);
        return Ok(config);
    }
}
