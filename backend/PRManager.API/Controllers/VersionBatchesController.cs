using Microsoft.AspNetCore.Mvc;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;

namespace PRManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VersionBatchesController : ControllerBase
{
    private readonly IVersionBatchService _batchService;

    public VersionBatchesController(IVersionBatchService batchService)
    {
        _batchService = batchService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VersionBatchDto>>> GetAll()
    {
        var batches = await _batchService.GetAllAsync();
        return Ok(batches);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VersionBatchDto>> GetById(int id)
    {
        var batch = await _batchService.GetByIdAsync(id);
        if (batch == null) return NotFound();
        return Ok(batch);
    }

    [HttpGet("by-id/{batchId}")]
    public async Task<ActionResult<VersionBatchDto>> GetByBatchId(string batchId)
    {
        var batch = await _batchService.GetByBatchIdAsync(batchId);
        if (batch == null) return NotFound();
        return Ok(batch);
    }

    [HttpPost]
    public async Task<ActionResult<VersionBatchDto>> Create([FromBody] CreateVersionBatchDto dto)
    {
        var batch = await _batchService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = batch.Id }, batch);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VersionBatchDto>> Update(int id, [FromBody] UpdateVersionBatchDto dto)
    {
        var batch = await _batchService.UpdateAsync(id, dto);
        if (batch == null) return NotFound();
        return Ok(batch);
    }

    [HttpPut("by-id/{batchId}")]
    public async Task<ActionResult<VersionBatchDto>> UpdateByBatchId(string batchId, [FromBody] UpdateVersionBatchDto dto)
    {
        var batch = await _batchService.UpdateByBatchIdAsync(batchId, dto);
        if (batch == null) return NotFound();
        return Ok(batch);
    }

    [HttpPost("save-version")]
    public async Task<ActionResult<IEnumerable<PullRequestDto>>> SaveVersionBatch([FromBody] BatchSaveVersionDto dto)
    {
        var prs = await _batchService.SaveVersionBatchAsync(dto);
        return Ok(prs);
    }

    [HttpPost("request-version")]
    public async Task<ActionResult<IEnumerable<PullRequestDto>>> RequestVersionBatch([FromBody] BatchRequestVersionDto dto)
    {
        var prs = await _batchService.RequestVersionBatchAsync(dto);
        return Ok(prs);
    }

    [HttpPost("release-to-staging/{batchId}")]
    public async Task<ActionResult<VersionBatchDto>> ReleaseToStaging(string batchId)
    {
        var batch = await _batchService.ReleaseToStagingAsync(batchId);
        if (batch == null) return NotFound();
        return Ok(batch);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _batchService.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
