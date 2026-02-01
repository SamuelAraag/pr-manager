using Microsoft.AspNetCore.Mvc;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;

namespace PRManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SprintsController : ControllerBase
{
    private readonly ISprintService _sprintService;

    public SprintsController(ISprintService sprintService)
    {
        _sprintService = sprintService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SprintDto>>> GetAll()
    {
        var sprints = await _sprintService.GetAllAsync();
        return Ok(sprints);
    }

    [HttpPost]
    public async Task<ActionResult<SprintDto>> Create([FromBody] CreateSprintDto dto)
    {
        var sprint = await _sprintService.CreateAsync(dto);
        return CreatedAtAction(nameof(Create), new { id = sprint.Id }, sprint);
    }

    [HttpPost("{id}/complete")]
    public async Task<ActionResult<SprintDto>> Complete(int id)
    {
        var sprint = await _sprintService.CompleteAsync(id);
        if (sprint == null) return NotFound();
        return Ok(sprint);
    }

    [HttpPost("{id}/add-batch")]
    public async Task<ActionResult<SprintDto>> AddBatch(int id, [FromBody] AddBatchToSprintDto dto)
    {
        var sprint = await _sprintService.AddBatchAsync(id, dto.BatchId);
        if (sprint == null) return NotFound();
        return Ok(sprint);
    }
}
