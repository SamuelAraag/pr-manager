namespace PRManager.Application.DTOs;

public class BatchRequestVersionDto
{
    public List<int> PrIds { get; set; } = new();
    public string? BatchId { get; set; }
}
