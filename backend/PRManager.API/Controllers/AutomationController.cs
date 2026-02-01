using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;

namespace PRManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "Admin,Gesto,Qa")]
public class AutomationController : ControllerBase
{
    private readonly IGitLabService _gitLabService;

    public AutomationController(IGitLabService gitLabService)
    {
        _gitLabService = gitLabService;
    }

    [HttpPost("create-issue/{batchId}")]
    public async Task<ActionResult<object>> CreateIssue(string batchId)
    {
        try
        {
            var webUrl = await _gitLabService.CreateIssueAsync(batchId);
            return Ok(new { webUrl });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
