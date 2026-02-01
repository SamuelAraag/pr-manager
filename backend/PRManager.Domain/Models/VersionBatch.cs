using System.ComponentModel.DataAnnotations;
using PRManager.Domain.Enums;

namespace PRManager.Domain.Models;

public class VersionBatch
{
    public int Id { get; set; }
    public string BatchId { get; set; } = string.Empty; // Human readable or internal batch ID
    public string Project { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string PipelineLink { get; set; } = string.Empty;
    public string Rollback { get; set; } = string.Empty;
    public string? GitlabIssueLink { get; set; }
    
    // Status and Audit
    public BatchStatus Status { get; set; } = BatchStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Property
    public ICollection<PullRequest> PullRequests { get; set; } = new List<PullRequest>();
    
    public int? SprintId { get; set; }
    public Sprint? Sprint { get; set; }
}
