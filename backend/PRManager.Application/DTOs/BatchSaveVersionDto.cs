namespace PRManager.Application.DTOs;

public class BatchSaveVersionDto
{
    public string BatchId { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string PipelineLink { get; set; } = string.Empty;
    public string Rollback { get; set; } = string.Empty;
}
