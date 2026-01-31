using PRManager.Domain.Enums;

namespace PRManager.Domain.Models;

public class PullRequest
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty; // Original ID from frontend
    
    // Basic Info
    public string Project { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    
    // Developer
    public int DevId { get; set; }
    public User Dev { get; set; } = null!;
    
    // Links
    public string PrLink { get; set; } = string.Empty;
    public string? TaskLink { get; set; }
    public string? TeamsLink { get; set; }
    
    // Status
    public PRStatus Status { get; set; } = PRStatus.Open;
    public string ReqVersion { get; set; } = "pending";
    
    // Approval
    public bool Approved { get; set; }
    public int? ApprovedById { get; set; }
    public User? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    
    // Correction
    public bool NeedsCorrection { get; set; }
    public string? CorrectionReason { get; set; }
    
    // Versioning
    public bool VersionRequested { get; set; }
    public string? VersionBatchId { get; set; }
    public string? Version { get; set; }
    public string? PipelineLink { get; set; }
    public string? Rollback { get; set; }
    public string? VersionGroupStatus { get; set; }
    
    // GitLab/Service Desk
    public string? GitlabIssueLink { get; set; }
    
    // Deploy
    public bool DeployedToStg { get; set; }
    public DateTime? DeployedToStgAt { get; set; }
    
    // Sprint
    public int? SprintId { get; set; }
    public Sprint? Sprint { get; set; }
    
    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Business Methods
    public void Approve(User approver)
    {
        Approved = true;
        ApprovedBy = approver;
        ApprovedById = approver.Id;
        ApprovedAt = DateTime.UtcNow;
        Status = PRStatus.Approved;
        UpdatedAt = DateTime.UtcNow;
    }
    
    public void RequestCorrection(string reason)
    {
        NeedsCorrection = true;
        CorrectionReason = reason;
        Status = PRStatus.NeedsCorrection;
        UpdatedAt = DateTime.UtcNow;
    }
    
    public void RequestVersion(string batchId)
    {
        VersionRequested = true;
        VersionBatchId = batchId;
        Status = PRStatus.VersionRequested;
        UpdatedAt = DateTime.UtcNow;
    }
    
    public void DeployToStaging(string version, string pipelineLink, string rollback, string gitlabIssueLink)
    {
        Version = version;
        PipelineLink = pipelineLink;
        Rollback = rollback;
        GitlabIssueLink = gitlabIssueLink;
        DeployedToStg = true;
        DeployedToStgAt = DateTime.UtcNow;
        Status = PRStatus.DeployedToStaging;
        UpdatedAt = DateTime.UtcNow;
    }
    
    public void MarkAsDone()
    {
        VersionGroupStatus = "done";
        Status = PRStatus.Done;
        UpdatedAt = DateTime.UtcNow;
    }
}
