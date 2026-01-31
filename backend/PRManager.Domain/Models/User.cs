using PRManager.Domain.Enums;

namespace PRManager.Domain.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    
    // Encrypted tokens for GitHub/GitLab integration
    public string? GitHubTokenEncrypted { get; set; }
    public string? GitLabTokenEncrypted { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    
    // Navigation properties
    public ICollection<PullRequest> PullRequests { get; set; } = new List<PullRequest>();
    public ICollection<PullRequest> ApprovedPullRequests { get; set; } = new List<PullRequest>();
}
