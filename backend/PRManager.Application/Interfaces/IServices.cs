using PRManager.Application.DTOs;
using PRManager.Domain.Models;

namespace PRManager.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
    string GenerateJwtToken(User user);
}

public interface IPullRequestService
{
    Task<IEnumerable<PullRequestDto>> GetAllAsync();
    Task<PullRequestDto?> GetByIdAsync(int id);
    Task<PullRequestDto> CreateAsync(CreatePullRequestDto dto, int userId);
    Task<PullRequestDto?> UpdateAsync(int id, UpdatePullRequestDto dto);
    Task<bool> DeleteAsync(int id, int userId);
    Task<PullRequestDto?> ApproveAsync(int id, int approverId);
    Task<PullRequestDto?> RequestCorrectionAsync(int id, RequestCorrectionDto dto);

    Task<PullRequestDto?> DeployToStagingAsync(int id, DeployToStagingDto dto);
    Task<PullRequestDto?> MarkAsDoneAsync(int id);
    Task<PullRequestDto?> MarkAsFixedAsync(int id);

}

public interface IAutomationConfigService
{
    Task<AutomationConfigDto> GetConfigAsync();
    Task<AutomationConfigDto> UpdateConfigAsync(UpdateAutomationConfigDto dto);
}

public interface IGitLabService
{
    Task<string> CreateIssueAsync(string batchId);
}
