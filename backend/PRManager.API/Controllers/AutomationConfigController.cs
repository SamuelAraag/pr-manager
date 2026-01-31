using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;

namespace PRManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Gestor")]
public class AutomationConfigController : ControllerBase
{
    private readonly IAutomationConfigService _configService;
    
    public AutomationConfigController(IAutomationConfigService configService)
    {
        _configService = configService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AutomationConfigDto>>> GetAll()
    {
        var configs = await _configService.GetAllAsync();
        return Ok(configs);
    }
    
    [HttpGet("{key}")]
    public async Task<ActionResult<AutomationConfigDto>> GetByKey(string key)
    {
        var config = await _configService.GetByKeyAsync(key);
        if (config == null)
            return NotFound();
        return Ok(config);
    }
    
    [HttpPost]
    public async Task<ActionResult<AutomationConfigDto>> Create([FromBody] CreateAutomationConfigDto dto)
    {
        var config = await _configService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetByKey), new { key = config.Key }, config);
    }
    
    [HttpPut("{key}")]
    public async Task<ActionResult<AutomationConfigDto>> Update(string key, [FromBody] UpdateAutomationConfigDto dto)
    {
        var config = await _configService.UpdateAsync(key, dto);
        if (config == null)
            return NotFound();
        return Ok(config);
    }
    
    [HttpDelete("{key}")]
    public async Task<ActionResult> Delete(string key)
    {
        var result = await _configService.DeleteAsync(key);
        if (!result)
            return NotFound();
        return NoContent();
    }
}
