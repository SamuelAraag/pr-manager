using Microsoft.EntityFrameworkCore;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;
using PRManager.Domain.Enums;
using PRManager.Domain.Models;
using PRManager.Infrastructure.Data;

namespace PRManager.Application.Services;

public class SprintService : ISprintService
{
    private readonly AppDbContext _context;

    public SprintService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SprintDto>> GetAllAsync()
    {
        var sprints = await _context.Sprints
            .Include(s => s.VersionBatches)
                .ThenInclude(v => v.PullRequests)
                    .ThenInclude(p => p.Dev)
            .OrderByDescending(s => s.EndDate)
            .ToListAsync();

        return sprints.Select(MapToDto);
    }

    public async Task<SprintDto> CreateAsync(CreateSprintDto dto)
    {
        var activeSprints = await _context.Sprints.Where(s => s.IsActive).ToListAsync();
        foreach (var activeSprint in activeSprints)
        {
            activeSprint.IsActive = false;
        }

        var sprint = new Sprint
        {
            Name = dto.Name,
            StartDate = dto.StartDate ?? DateTime.UtcNow,
            EndDate = dto.EndDate,
            IsActive = true
        };

        _context.Sprints.Add(sprint);
        await _context.SaveChangesAsync();

        return MapToDto(sprint);
    }

    public async Task<SprintDto?> CompleteAsync(int id)
    {
        var sprint = await _context.Sprints
            .Include(s => s.VersionBatches)
            .ThenInclude(v => v.PullRequests)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sprint == null) return null;

        sprint.IsActive = false;
        sprint.EndDate = DateTime.UtcNow;

        var batches = sprint.VersionBatches.ToList();

        foreach (var batch in batches)
        {
            if (batch.Status == BatchStatus.Deployed)
            {
                // Finished: Archive
                batch.Status = BatchStatus.Archived;
                batch.UpdatedAt = DateTime.UtcNow;

                foreach (var pr in batch.PullRequests)
                {
                    pr.Status = PRStatus.Done;
                    pr.UpdatedAt = DateTime.UtcNow;
                }
            }
            else
            {
                // Unfinished: Remove from this sprint so it doesn't go to history
                // It will be linked to the next active sprint later or stay in backlog
                batch.SprintId = null; 
                batch.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
        return MapToDto(sprint);
    }

    public async Task<SprintDto?> AddBatchAsync(int id, string batchId)
    {
        var sprint = await _context.Sprints.FindAsync(id);
        if (sprint == null) return null;

        var batch = await _context.VersionBatches
            .FirstOrDefaultAsync(v => v.BatchId == batchId);
        
        if (batch == null) return null;

        batch.SprintId = sprint.Id;
        batch.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        sprint = await _context.Sprints
            .Include(s => s.VersionBatches)
            .FirstAsync(s => s.Id == id);

        return MapToDto(sprint);
    }

    private static SprintDto MapToDto(Sprint sprint)
    {
        return new SprintDto
        {
            Id = sprint.Id,
            Name = sprint.Name,
            StartDate = sprint.StartDate,
            EndDate = sprint.EndDate,
            IsActive = sprint.IsActive,
            VersionBatches = sprint.VersionBatches.Select(v => new VersionBatchDto
            {
                Id = v.Id,
                BatchId = v.BatchId,
                Project = v.Project,
                Version = v.Version,
                PipelineLink = v.PipelineLink,
                Rollback = v.Rollback,
                GitlabIssueLink = v.GitlabIssueLink,
                Status = v.Status.ToString(),
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt,
                PullRequests = v.PullRequests.Select(p => new PullRequestDto
                {
                    Id = p.Id,
                    ExternalId = p.ExternalId,
                    Project = p.Project,
                    Summary = p.Summary,
                    Dev = p.Dev?.Name ?? "Unknown",
                    DevId = p.DevId,
                    PrLink = p.PrLink,
                    TaskLink = p.TaskLink,
                    TeamsLink = p.TeamsLink,
                    Status = p.Status.ToString(),
                    ReqVersion = p.ReqVersion,
                    Approved = p.Approved,
                    VersionGroupStatus = p.VersionGroupStatus,
                    GitlabIssueLink = p.GitlabIssueLink,
                    DeployedToStg = p.DeployedToStg,
                    Version = p.Version
                }).ToList()
            }).ToList()
        };
    }
}
