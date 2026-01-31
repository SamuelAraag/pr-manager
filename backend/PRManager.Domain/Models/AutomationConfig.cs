namespace PRManager.Domain.Models;

public class AutomationConfig
{
    public int Id { get; set; }
    public string GithubToken { get; set; } = string.Empty;
    public string GitlabToken { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
