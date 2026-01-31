using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;
using PRManager.Domain.Models;
using PRManager.Infrastructure.Data;

namespace PRManager.Application.Services;

public class AutomationConfigService : IAutomationConfigService
{
    private readonly AppDbContext _context;
    
    public AutomationConfigService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<AutomationConfigDto> GetConfigAsync()
    {
        var config = await _context.AutomationConfigs.FirstOrDefaultAsync();
            
        if (config == null)
        {
            return new AutomationConfigDto();
        }
            
        return new AutomationConfigDto
        {
            GithubToken = config.GithubToken,
            GitlabToken = config.GitlabToken
        };
    }
    
    public async Task<AutomationConfigDto> UpdateConfigAsync(UpdateAutomationConfigDto dto)
    {
        var config = await _context.AutomationConfigs.FirstOrDefaultAsync();
            
        if (config == null)
        {
            config = new AutomationConfig();
            _context.AutomationConfigs.Add(config);
        }
        
        config.GithubToken = dto.GithubToken;
        config.GitlabToken = dto.GitlabToken;
        config.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        
        return await GetConfigAsync();
    }
}
