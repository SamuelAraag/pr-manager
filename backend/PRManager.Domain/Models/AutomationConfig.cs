namespace PRManager.Domain.Models;

public class AutomationConfig
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Chaves pré-definidas para configurações comuns
    public static class Keys
    {
        public const string GitHubToken = "GitHub.Token";
        public const string GitLabToken = "GitLab.Token";
        public const string GitLabUrl = "GitLab.Url";
        public const string GitLabProjectId = "GitLab.ProjectId";
        public const string JiraUrl = "Jira.Url";
        public const string JiraToken = "Jira.Token";
        public const string TeamsWebhookUrl = "Teams.WebhookUrl";
    }
}
