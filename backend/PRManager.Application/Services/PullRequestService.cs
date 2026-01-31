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
        // Find or create user by name
        var dev = await _context.Users
            .FirstOrDefaultAsync(u => u.Name == dto.DevName);
            
        if (dev == null)
        {
            // Create a basic user if not found (for migration compatibility)
            dev = new User
            {
                Name = dto.DevName,
                Email = $"{dto.DevName.Replace(" ", ".").ToLower()}@company.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = UserRole.Dev
            };
            _context.Users.Add(dev);
            await _context.SaveChangesAsync();
        }
        
        // Get active sprint
        var activeSprint = await _context.Sprints
            .FirstOrDefaultAsync(s => s.IsActive);
        
        var pr = new PullRequest
        {
            ExternalId = Guid.NewGuid().ToString(),
            Project = dto.Project,
            Summary = dto.Summary,
            DevId = dev.Id,
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
    
    public async Task<PullRequestDto?> UpdateAsync(int id, UpdatePullRequestDto dto, int userId)
    {
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (pr == null)
            return null;
        
        // Only dev who created it can update
        if (pr.DevId != userId)
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
            
        pr.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        
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
        var pr = await _context.PullRequests
            .Include(p => p.Dev)
            .Include(p => p.Sprint)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (pr == null)
            return null;
        
        pr.RequestVersion(dto.BatchId);
        await _context.SaveChangesAsync();
        
        return MapToDto(pr);
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
