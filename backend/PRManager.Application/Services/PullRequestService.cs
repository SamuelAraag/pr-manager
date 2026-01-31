using Microsoft.EntityFrameworkCore;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;
using PRManager.Domain.Enums;
using PRManager.Domain.Models;
using PRManager.Infrastructure.Data;

namespace PRManager.Application.Services;

public class PullRequestService : IPullRequestService
{
    private readonly AppDbContext _context;
    
    public PullRequestService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<PullRequestDto>> GetAllAsync()
    {
        var prs = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.ApprovedBy)
            .Include(p => p.Sprint)
            .OrderByDescending(p => p.UpdatedAt)
            .ToListAsync();
            
        return prs.Select(MapToDto);
    }
    
    public async Task<PullRequestDto?> GetByIdAsync(int id)
    {
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.ApprovedBy)
            .Include(p => p.Sprint)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        return pr == null ? null : MapToDto(pr);
    }
    
    public async Task<PullRequestDto> CreateAsync(CreatePullRequestDto dto, int userId)
    {
        // Verify dev exists
        var dev = await _context.Users.FindAsync(dto.DevId)
            ?? throw new ArgumentException($"Developer with ID {dto.DevId} not found");
        
        // Get active sprint
        var activeSprint = await _context.Sprints
            .FirstOrDefaultAsync(s => s.IsActive);
        
        var pr = new PullRequest
        {
            ExternalId = Guid.NewGuid().ToString(),
            Project = dto.Project,
            Summary = dto.Summary,
            DevId = dto.DevId,
            PrLink = dto.PrLink,
            TaskLink = dto.TaskLink,
            TeamsLink = dto.TeamsLink,
            SprintId = activeSprint?.Id,
            Status = PRStatus.Open,
            ReqVersion = "pending"
        };
        
        _context.PullRequests.Add(pr);
        await _context.SaveChangesAsync();
        
        // Reload with includes
        pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .FirstAsync(p => p.Id == pr.Id);
        
        return MapToDto(pr);
    }
    
    public async Task<PullRequestDto?> UpdateAsync(int id, UpdatePullRequestDto dto)
    {
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (pr == null)
            return null;
        
        if (!string.IsNullOrEmpty(dto.Project))
            pr.Project = dto.Project;
        if (!string.IsNullOrEmpty(dto.Summary))
            pr.Summary = dto.Summary;
        if (!string.IsNullOrEmpty(dto.PrLink))
            pr.PrLink = dto.PrLink;
        if (dto.TaskLink != null)
            pr.TaskLink = dto.TaskLink;
        if (dto.TeamsLink != null)
            pr.TeamsLink = dto.TeamsLink;
            
        // Handle DevId change
        if (dto.DevId.HasValue && dto.DevId.Value != pr.DevId)
        {
            var newDev = await _context.Users.FindAsync(dto.DevId.Value);
            if (newDev == null)
                throw new ArgumentException($"Developer with ID {dto.DevId.Value} not found");
            
            pr.DevId = dto.DevId.Value;
        }
            
        pr.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        
        // Reload with updated dev
        pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .FirstAsync(p => p.Id == id);
        
        return MapToDto(pr);
    }
    
    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var pr = await _context.PullRequests.FindAsync(id);
        if (pr == null)
            return false;
            
        // Only dev who created it can delete
        if (pr.DevId != userId)
            return false;
        
        _context.PullRequests.Remove(pr);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<PullRequestDto?> ApproveAsync(int id, int approverId)
    {
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (pr == null)
            return null;
        
        var approver = await _context.Users.FindAsync(approverId);
        if (approver == null)
            return null;
        
        pr.Approve(approver);
        await _context.SaveChangesAsync();
        
        // Reload with approver
        pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.ApprovedBy)
            .Include(p => p.Sprint)
            .FirstAsync(p => p.Id == id);
        
        return MapToDto(pr);
    }
    
    public async Task<PullRequestDto?> RequestCorrectionAsync(int id, RequestCorrectionDto dto)
    {
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (pr == null)
            return null;
        
        pr.RequestCorrection(dto.Reason);
        await _context.SaveChangesAsync();
        
        return MapToDto(pr);
    }
    
    public async Task<PullRequestDto?> RequestVersionAsync(int id, RequestVersionDto dto)
    {
        // Legacy single item wrapper or specific single logic
        var batchDto = new BatchRequestVersionDto { PrIds = new List<int> { id }, BatchId = dto.BatchId };
        var results = await RequestVersionBatchAsync(batchDto);
        return results.FirstOrDefault();
    }

    public async Task<IEnumerable<PullRequestDto>> RequestVersionBatchAsync(BatchRequestVersionDto dto)
    {
        if (dto.PrIds == null || !dto.PrIds.Any())
            return Enumerable.Empty<PullRequestDto>();

        var batchId = !string.IsNullOrEmpty(dto.BatchId) 
            ? dto.BatchId 
            : $"batch_{DateTime.Now.Ticks}_{Guid.NewGuid().ToString().Substring(0, 8)}";

        var prs = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .Where(p => dto.PrIds.Contains(p.Id))
            .ToListAsync();

        foreach (var pr in prs)
        {
            if (string.IsNullOrEmpty(pr.Version) && string.IsNullOrEmpty(pr.VersionBatchId))
            {
                pr.RequestVersion(batchId);
            }
        }
        
        await _context.SaveChangesAsync();
        
        return prs.Select(MapToDto);
    }
    
    public async Task<PullRequestDto?> DeployToStagingAsync(int id, DeployToStagingDto dto)
    {
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (pr == null)
            return null;
        
        pr.DeployToStaging(dto.Version, dto.PipelineLink, dto.Rollback, dto.GitlabIssueLink);
        await _context.SaveChangesAsync();
        
        return MapToDto(pr);
    }
    
    public async Task<PullRequestDto?> MarkAsDoneAsync(int id)
    {
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (pr == null)
            return null;
        
        pr.MarkAsDone();
        await _context.SaveChangesAsync();
        
        return MapToDto(pr);
    }
    
    public async Task<PullRequestDto?> MarkAsFixedAsync(int id)
    {
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (pr == null)
            return null;
        
        pr.NeedsCorrection = false;
        pr.CorrectionReason = null;
        pr.ReqVersion = "ok"; // Reset version status
        
        await _context.SaveChangesAsync();
        
        return MapToDto(pr);
    }
    
    private static PullRequestDto MapToDto(PullRequest pr)
    {
        return new PullRequestDto
        {
            Id = pr.Id,
            ExternalId = pr.ExternalId,
            Project = pr.Project,
            Summary = pr.Summary,
            Dev = pr.Dev.Name,
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
            VersionBatchId = pr.VersionBatchId,
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
