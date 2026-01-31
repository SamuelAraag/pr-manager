using Microsoft.EntityFrameworkCore;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;
using PRManager.Domain.Enums;
using PRManager.Domain.Models;
using PRManager.Infrastructure.Data;

namespace PRManager.Application.Services;

public class VersionBatchService : IVersionBatchService
{
    private readonly AppDbContext _context;

    public VersionBatchService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<VersionBatchDto>> GetAllAsync()
    {
        var batches = await _context.VersionBatches
            .Include(v => v.PullRequests)
                .ThenInclude(p => p.Dev)
            .OrderByDescending(v => v.UpdatedAt)
            .ToListAsync();

        return batches.Select(MapToDto);
    }

    public async Task<VersionBatchDto?> GetByIdAsync(int id)
    {
        var batch = await _context.VersionBatches
            .Include(v => v.PullRequests)
                .ThenInclude(p => p.Dev)
            .FirstOrDefaultAsync(v => v.Id == id);

        return batch == null ? null : MapToDto(batch);
    }

    public async Task<VersionBatchDto?> GetByBatchIdAsync(string batchId)
    {
        var batch = await _context.VersionBatches
            .Include(v => v.PullRequests)
                .ThenInclude(p => p.Dev)
            .FirstOrDefaultAsync(v => v.BatchId == batchId);

        return batch == null ? null : MapToDto(batch);
    }

    public async Task<VersionBatchDto> CreateAsync(CreateVersionBatchDto dto)
    {
        var batchId = $"batch_{DateTime.Now.Ticks}_{Guid.NewGuid().ToString().Substring(0, 8)}";
        
        var batch = new VersionBatch
        {
            BatchId = batchId,
            Project = dto.Project,
            Status = BatchStatus.Pending
        };

        _context.VersionBatches.Add(batch);
        
        if (dto.PrIds.Any())
        {
            var prs = await _context.PullRequests
                .Where(p => dto.PrIds.Contains(p.Id))
                .ToListAsync();

            foreach (var pr in prs)
            {
                pr.VersionBatchRef = batch;
                pr.VersionRequested = true;
                pr.Status = PRStatus.VersionRequested;
            }
        }

        await _context.SaveChangesAsync();

        // Reload to get includes
        return await GetByIdAsync(batch.Id) ?? MapToDto(batch);
    }

    public async Task<VersionBatchDto?> UpdateAsync(int id, UpdateVersionBatchDto dto)
    {
        var batch = await _context.VersionBatches
            .Include(v => v.PullRequests)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (batch == null) return null;

        UpdateBatchFromDto(batch, dto);
        await _context.SaveChangesAsync();

        return MapToDto(batch);
    }

    public async Task<VersionBatchDto?> UpdateByBatchIdAsync(string batchId, UpdateVersionBatchDto dto)
    {
        var batch = await _context.VersionBatches
            .Include(v => v.PullRequests)
            .FirstOrDefaultAsync(v => v.BatchId == batchId);

        if (batch == null) return null;

        UpdateBatchFromDto(batch, dto);
        await _context.SaveChangesAsync();

        return MapToDto(batch);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var batch = await _context.VersionBatches.FindAsync(id);
        if (batch == null) return false;

        _context.VersionBatches.Remove(batch);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<PullRequestDto>> SaveVersionBatchAsync(BatchSaveVersionDto dto)
    {
        if (string.IsNullOrEmpty(dto.BatchId))
            return Enumerable.Empty<PullRequestDto>();

        var versionBatch = await _context.VersionBatches
            .Include(v => v.PullRequests)
                .ThenInclude(p => p.Dev)
            .Include(v => v.PullRequests)
                .ThenInclude(p => p.ApprovedBy)
            .Include(v => v.PullRequests)
                .ThenInclude(p => p.Sprint)
            .Include(v => v.PullRequests)
                .ThenInclude(p => p.VersionBatchRef)
            .FirstOrDefaultAsync(v => v.BatchId == dto.BatchId);

        if (versionBatch == null)
            return Enumerable.Empty<PullRequestDto>();

        versionBatch.Version = dto.Version;
        versionBatch.PipelineLink = dto.PipelineLink;
        versionBatch.Rollback = dto.Rollback;
        versionBatch.Status = BatchStatus.Released;
        versionBatch.UpdatedAt = DateTime.UtcNow;

        foreach (var pr in versionBatch.PullRequests)
        {
            pr.SetVersionBatch(dto.Version, dto.PipelineLink, dto.Rollback);
        }

        await _context.SaveChangesAsync();
        return versionBatch.PullRequests.Select(MapToPullRequestDto);
    }

    public async Task<IEnumerable<PullRequestDto>> RequestVersionBatchAsync(BatchRequestVersionDto dto)
    {
        if (dto.PrIds == null || !dto.PrIds.Any())
            return Enumerable.Empty<PullRequestDto>();

        var batchId = !string.IsNullOrEmpty(dto.BatchId) 
            ? dto.BatchId 
            : $"batch_{DateTime.Now.Ticks}_{Guid.NewGuid().ToString().Substring(0, 8)}";

        // Get PRs and check project
        var prs = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.ApprovedBy)
            .Include(p => p.Sprint)
            .Include(p => p.VersionBatchRef)
            .Where(p => dto.PrIds.Contains(p.Id))
            .ToListAsync();

        if (!prs.Any()) return Enumerable.Empty<PullRequestDto>();

        var project = prs.First().Project;

        // Create VersionBatch record
        var versionBatch = new VersionBatch
        {
            BatchId = batchId,
            Project = project,
            Status = BatchStatus.Pending
        };
        _context.VersionBatches.Add(versionBatch);

        foreach (var pr in prs)
        {
            if (string.IsNullOrEmpty(pr.Version) && pr.VersionBatchRefId == null)
            {
                pr.RequestVersion();
                pr.VersionBatchRef = versionBatch;
            }
        }
        
        await _context.SaveChangesAsync();
        
        return prs.Select(MapToPullRequestDto);
    }

    private void UpdateBatchFromDto(VersionBatch batch, UpdateVersionBatchDto dto)
    {
        if (dto.Version != null) batch.Version = dto.Version;
        if (dto.PipelineLink != null) batch.PipelineLink = dto.PipelineLink;
        if (dto.Rollback != null) batch.Rollback = dto.Rollback;
        if (dto.GitlabIssueLink != null) batch.GitlabIssueLink = dto.GitlabIssueLink;
        if (dto.Status != null && Enum.TryParse<BatchStatus>(dto.Status, true, out var status))
        {
            batch.Status = status;
        }

        batch.UpdatedAt = DateTime.UtcNow;

        // Propagate to PRs if necessary
        foreach (var pr in batch.PullRequests)
        {
            if (dto.Version != null) pr.Version = dto.Version;
            if (dto.PipelineLink != null) pr.PipelineLink = dto.PipelineLink;
            if (dto.Rollback != null) pr.Rollback = dto.Rollback;
            if (dto.GitlabIssueLink != null) pr.GitlabIssueLink = dto.GitlabIssueLink;
            
            if (batch.Status == BatchStatus.Released || batch.Status == BatchStatus.Deployed)
            {
                pr.VersionGroupStatus = "done";
                pr.VersionRequested = false;
            }
        }
    }

    private static VersionBatchDto MapToDto(VersionBatch batch)
    {
        return new VersionBatchDto
        {
            Id = batch.Id,
            BatchId = batch.BatchId,
            Project = batch.Project,
            Version = batch.Version,
            PipelineLink = batch.PipelineLink,
            Rollback = batch.Rollback,
            GitlabIssueLink = batch.GitlabIssueLink,
            Status = batch.Status.ToString(),
            CreatedAt = batch.CreatedAt,
            UpdatedAt = batch.UpdatedAt,
            PullRequests = batch.PullRequests.Select(MapToPullRequestDto).ToList()
        };
    }

    private static PullRequestDto MapToPullRequestDto(PullRequest pr)
    {
        return new PullRequestDto
        {
            Id = pr.Id,
            ExternalId = pr.ExternalId,
            Project = pr.Project,
            Summary = pr.Summary,
            Dev = pr.Dev?.Name ?? "Unknown",
            DevId = pr.DevId,
            PrLink = pr.PrLink,
            TaskLink = pr.TaskLink,
            TeamsLink = pr.TeamsLink,
            Status = pr.Status.ToString(),
            ReqVersion = pr.ReqVersion,
            Approved = pr.Approved,
            ApprovedBy = pr.ApprovedBy?.Name,
            ApprovedAt = pr.ApprovedAt,
            NeedsCorrection = pr.NeedsCorrection,
            CorrectionReason = pr.CorrectionReason,
            VersionRequested = pr.VersionRequested,
            VersionBatchId = pr.VersionBatchRef?.BatchId,
            VersionBatchRefId = pr.VersionBatchRefId,
            Version = pr.Version,
            PipelineLink = pr.PipelineLink,
            Rollback = pr.Rollback,
            VersionGroupStatus = pr.VersionGroupStatus,
            GitlabIssueLink = pr.GitlabIssueLink,
            DeployedToStg = pr.DeployedToStg,
            DeployedToStgAt = pr.DeployedToStgAt,
            Sprint = pr.Sprint?.Name,
            CreatedAt = pr.CreatedAt,
            UpdatedAt = pr.UpdatedAt
        };
    }
}
