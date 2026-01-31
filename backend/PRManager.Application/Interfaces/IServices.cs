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
    Task<PullRequestDto?> RequestVersionAsync(int id, RequestVersionDto dto);
    Task<PullRequestDto?> DeployToStagingAsync(int id, DeployToStagingDto dto);
    Task<PullRequestDto?> MarkAsDoneAsync(int id);
}

public interface IAutomationConfigService
{
    Task<IEnumerable<AutomationConfigDto>> GetAllAsync();
    Task<AutomationConfigDto?> GetByKeyAsync(string key);
    Task<AutomationConfigDto> CreateAsync(CreateAutomationConfigDto dto);
    Task<AutomationConfigDto?> UpdateAsync(string key, UpdateAutomationConfigDto dto);
    Task<bool> DeleteAsync(string key);
    Task<string?> GetDecryptedValueAsync(string key);
}
