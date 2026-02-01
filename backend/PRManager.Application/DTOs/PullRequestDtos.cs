namespace PRManager.Application.DTOs;

public class PullRequestDto
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string Project { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Dev { get; set; } = string.Empty;
    public int DevId { get; set; }
    public string PrLink { get; set; } = string.Empty;
    public string? TaskLink { get; set; }
    public string? TeamsLink { get; set; }
    public string Status { get; set; } = string.Empty;
    public string ReqVersion { get; set; } = string.Empty;
    public bool Approved { get; set; }
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public bool NeedsCorrection { get; set; }
    public string? CorrectionReason { get; set; }
    public bool VersionRequested { get; set; }
    public string? VersionBatchId { get; set; }
    public int? VersionBatchRefId { get; set; }
    public string? Version { get; set; }
    public string? PipelineLink { get; set; }
    public string? Rollback { get; set; }
    public string? VersionGroupStatus { get; set; }
    public string? GitlabIssueLink { get; set; }
    public bool DeployedToStg { get; set; }
    public DateTime? DeployedToStgAt { get; set; }
    public bool SprintCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int? SprintId { get; set; }
    public string? Sprint { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreatePullRequestDto
{
    public string Project { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public int DevId { get; set; }
    public string PrLink { get; set; } = string.Empty;
    public string? TaskLink { get; set; }
    public string? TeamsLink { get; set; }
}

public class UpdatePullRequestDto
{
    public string? Project { get; set; }
    public string? Summary { get; set; }
    public int? DevId { get; set; }
    public string? PrLink { get; set; }
    public string? TaskLink { get; set; }
    public string? TeamsLink { get; set; }
}

public class ApproveDto
{
    public int ApproverId { get; set; }
}

public class RequestCorrectionDto
{
    public string Reason { get; set; } = string.Empty;
}

public class RequestVersionDto
{
    public string BatchId { get; set; } = string.Empty;
}

public class DeployToStagingDto
{
    public string Version { get; set; } = string.Empty;
    public string PipelineLink { get; set; } = string.Empty;
    public string Rollback { get; set; } = string.Empty;
    public string GitlabIssueLink { get; set; } = string.Empty;
}
