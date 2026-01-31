namespace PRManager.Application.DTOs;

public class AutomationConfigDto
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateAutomationConfigDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; } = false;
}

public class UpdateAutomationConfigDto
{
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
}
