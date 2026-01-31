namespace PRManager.Application.DTOs;

public class AutomationConfigDto
{
    public string GithubToken { get; set; } = string.Empty;
    public string GitlabToken { get; set; } = string.Empty;
}

public class UpdateAutomationConfigDto
{
    public string GithubToken { get; set; } = string.Empty;
    public string GitlabToken { get; set; } = string.Empty;
}
