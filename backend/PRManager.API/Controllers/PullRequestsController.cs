using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;
using System.Security.Claims;

namespace PRManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//TODO: back to [Authorize]
public class PullRequestsController : ControllerBase
{
    private readonly IPullRequestService _prService;
    
    public PullRequestsController(IPullRequestService prService)
    {
        _prService = prService;
    }
    
    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PullRequestDto>>> GetAll()
    {
        var prs = await _prService.GetAllAsync();
        return Ok(prs);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<PullRequestDto>> GetById(int id)
    {
        var pr = await _prService.GetByIdAsync(id);
        if (pr == null)
            return NotFound();
        return Ok(pr);
    }
    
    [HttpPost]
    public async Task<ActionResult<PullRequestDto>> Create([FromBody] CreatePullRequestDto dto)
    {
        var userId = GetCurrentUserId();
        var pr = await _prService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = pr.Id }, pr);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<PullRequestDto>> Update(int id, [FromBody] UpdatePullRequestDto dto)
    {
        var pr = await _prService.UpdateAsync(id, dto);
        if (pr == null)
            return NotFound();
        return Ok(pr);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var userId = GetCurrentUserId();
        var result = await _prService.DeleteAsync(id, userId);
        if (!result)
            return NotFound();
        return NoContent();
    }
    
    [HttpPost("{id}/approve")]
    //[Authorize(Roles = "QA,Gestor,Admin")]
    public async Task<ActionResult<PullRequestDto>> Approve(int id, [FromBody] ApproveDto dto)
    {
        var pr = await _prService.ApproveAsync(id, dto.ApproverId);
        if (pr == null)
            return NotFound();
        return Ok(pr);
    }
    
    [HttpPost("{id}/request-correction")]
    // [Authorize(Roles = "QA,Gestor,Admin")]
    public async Task<ActionResult<PullRequestDto>> RequestCorrection(int id, [FromBody] RequestCorrectionDto dto)
    {
        var pr = await _prService.RequestCorrectionAsync(id, dto);
        if (pr == null)
            return NotFound();
        return Ok(pr);
    }
    
    [HttpPost("{id}/request-version")]
    [Authorize(Roles = "QA,Admin")]
    public async Task<ActionResult<PullRequestDto>> RequestVersion(int id, [FromBody] RequestVersionDto dto)
    {
        var pr = await _prService.RequestVersionAsync(id, dto);
        if (pr == null)
            return NotFound();
        return Ok(pr);
    }
    
    [HttpPost("{id}/deploy-staging")]
    [Authorize(Roles = "QA,Admin")]
    public async Task<ActionResult<PullRequestDto>> DeployToStaging(int id, [FromBody] DeployToStagingDto dto)
    {
        var pr = await _prService.DeployToStagingAsync(id, dto);
        if (pr == null)
            return NotFound();
        return Ok(pr);
    }
    
    [HttpPost("{id}/mark-fixed")]
    //[Authorize(Roles = "Dev,Admin")]
    public async Task<ActionResult<PullRequestDto>> MarkAsFixed(int id)
    {
        var pr = await _prService.MarkAsFixedAsync(id);
        if (pr == null)
            return NotFound();
        return Ok(pr);
    }

    [HttpPost("{id}/mark-done")]
    [Authorize(Roles = "QA,Admin")]
    public async Task<ActionResult<PullRequestDto>> MarkAsDone(int id)
    {
        var pr = await _prService.MarkAsDoneAsync(id);
        if (pr == null)
            return NotFound();
        return Ok(pr);
    }
}
