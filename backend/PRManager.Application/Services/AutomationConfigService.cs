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
    private const string EncryptionKey = "PRManager2026SecretKey!@#$%^&*()"; // Em produção, use User Secrets ou Azure Key Vault
    
    public AutomationConfigService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<AutomationConfigDto>> GetAllAsync()
    {
        var configs = await _context.AutomationConfigs
            .OrderBy(c => c.Key)
            .ToListAsync();
            
        return configs.Select(c => new AutomationConfigDto
        {
            Id = c.Id,
            Key = c.Key,
            Value = c.IsEncrypted ? "***ENCRYPTED***" : c.Value,
            Description = c.Description,
            IsEncrypted = c.IsEncrypted,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });
    }
    
    public async Task<AutomationConfigDto?> GetByKeyAsync(string key)
    {
        var config = await _context.AutomationConfigs
            .FirstOrDefaultAsync(c => c.Key == key);
            
        if (config == null)
            return null;
            
        return new AutomationConfigDto
        {
            Id = config.Id,
            Key = config.Key,
            Value = config.IsEncrypted ? "***ENCRYPTED***" : config.Value,
            Description = config.Description,
            IsEncrypted = config.IsEncrypted,
            CreatedAt = config.CreatedAt,
            UpdatedAt = config.UpdatedAt
        };
    }
    
    public async Task<AutomationConfigDto> CreateAsync(CreateAutomationConfigDto dto)
    {
        var config = new AutomationConfig
        {
            Key = dto.Key,
            Value = dto.IsEncrypted ? Encrypt(dto.Value) : dto.Value,
            Description = dto.Description,
            IsEncrypted = dto.IsEncrypted
        };
        
        _context.AutomationConfigs.Add(config);
        await _context.SaveChangesAsync();
        
        return new AutomationConfigDto
        {
            Id = config.Id,
            Key = config.Key,
            Value = config.IsEncrypted ? "***ENCRYPTED***" : config.Value,
            Description = config.Description,
            IsEncrypted = config.IsEncrypted,
            CreatedAt = config.CreatedAt,
            UpdatedAt = config.UpdatedAt
        };
    }
    
    public async Task<AutomationConfigDto?> UpdateAsync(string key, UpdateAutomationConfigDto dto)
    {
        var config = await _context.AutomationConfigs
            .FirstOrDefaultAsync(c => c.Key == key);
            
        if (config == null)
            return null;
        
        config.Value = config.IsEncrypted ? Encrypt(dto.Value) : dto.Value;
        config.Description = dto.Description ?? config.Description;
        config.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        
        return new AutomationConfigDto
        {
            Id = config.Id,
            Key = config.Key,
            Value = config.IsEncrypted ? "***ENCRYPTED***" : config.Value,
            Description = config.Description,
            IsEncrypted = config.IsEncrypted,
            CreatedAt = config.CreatedAt,
            UpdatedAt = config.UpdatedAt
        };
    }
    
    public async Task<bool> DeleteAsync(string key)
    {
        var config = await _context.AutomationConfigs
            .FirstOrDefaultAsync(c => c.Key == key);
            
        if (config == null)
            return false;
        
        _context.AutomationConfigs.Remove(config);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<string?> GetDecryptedValueAsync(string key)
    {
        var config = await _context.AutomationConfigs
            .FirstOrDefaultAsync(c => c.Key == key);
            
        if (config == null)
            return null;
        
        return config.IsEncrypted ? Decrypt(config.Value) : config.Value;
    }
    
    private static string Encrypt(string plainText)
    {
        if (string.IsNullOrEmpty(plainText))
            return plainText;
            
        using var aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(EncryptionKey.PadRight(32).Substring(0, 32));
        aes.IV = new byte[16]; // IV zero para simplificar, em produção use IV aleatório
        
        using var encryptor = aes.CreateEncryptor();
        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);
        
        return Convert.ToBase64String(encryptedBytes);
    }
    
    private static string Decrypt(string cipherText)
    {
        if (string.IsNullOrEmpty(cipherText))
            return cipherText;
            
        try
        {
            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(EncryptionKey.PadRight(32).Substring(0, 32));
            aes.IV = new byte[16];
            
            using var decryptor = aes.CreateDecryptor();
            var cipherBytes = Convert.FromBase64String(cipherText);
            var decryptedBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
            
            return Encoding.UTF8.GetString(decryptedBytes);
        }
        catch
        {
            return cipherText; // Se falhar, retorna o valor original
        }
    }
}
