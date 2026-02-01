using PRManager.Application.DTOs;

namespace PRManager.Application.Interfaces;

public interface IVersionBatchService
{
    Task<IEnumerable<VersionBatchDto>> GetAllAsync();
    Task<VersionBatchDto?> GetByIdAsync(int id);
    Task<VersionBatchDto?> GetByBatchIdAsync(string batchId);
    Task<VersionBatchDto> CreateAsync(CreateVersionBatchDto dto);
    Task<VersionBatchDto?> UpdateAsync(int id, UpdateVersionBatchDto dto);
    Task<VersionBatchDto?> UpdateByBatchIdAsync(string batchId, UpdateVersionBatchDto dto);
    Task<IEnumerable<PullRequestDto>> SaveVersionBatchAsync(BatchSaveVersionDto dto);
    Task<IEnumerable<PullRequestDto>> RequestVersionBatchAsync(BatchRequestVersionDto dto);
    Task<VersionBatchDto?> ReleaseToStagingAsync(string batchId);
    Task<bool> DeleteAsync(int id);
}
