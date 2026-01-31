namespace PRManager.Domain.Models;

public class Sprint
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    
    // Navigation properties
    public ICollection<PullRequest> PullRequests { get; set; } = new List<PullRequest>();
}
