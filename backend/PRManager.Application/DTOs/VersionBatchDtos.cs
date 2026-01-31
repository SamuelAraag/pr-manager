namespace PRManager.Application.DTOs;

public class VersionBatchDto
{
    public int Id { get; set; }
    public string BatchId { get; set; } = string.Empty;
    public string Project { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string PipelineLink { get; set; } = string.Empty;
    public string Rollback { get; set; } = string.Empty;
    public string? GitlabIssueLink { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<PullRequestDto> PullRequests { get; set; } = new();
}

public class CreateVersionBatchDto
{
    public string Project { get; set; } = string.Empty;
    public List<int> PrIds { get; set; } = new();
}

public class UpdateVersionBatchDto
{
    public string? Version { get; set; }
    public string? PipelineLink { get; set; }
    public string? Rollback { get; set; }
    public string? GitlabIssueLink { get; set; }
    public string? Status { get; set; }
}
