namespace PRManager.Application.DTOs;

public class SprintDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public List<VersionBatchDto> VersionBatches { get; set; } = new();
}

public class CreateSprintDto
{
    public string Name { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class AddBatchToSprintDto
{
    public string BatchId { get; set; } = string.Empty;
}
