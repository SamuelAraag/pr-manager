using Microsoft.EntityFrameworkCore;
using PRManager.Domain.Models;

namespace PRManager.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    
    public DbSet<PullRequest> PullRequests { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Sprint> Sprints { get; set; } = null!;
    public DbSet<AutomationConfig> AutomationConfigs { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // PullRequest configuration
        modelBuilder.Entity<PullRequest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ExternalId).IsUnique();
            entity.Property(e => e.Project).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Summary).IsRequired().HasMaxLength(500);
            entity.Property(e => e.PrLink).IsRequired().HasMaxLength(500);
            
            // Relationships
            entity.HasOne(e => e.Dev)
                .WithMany(u => u.PullRequests)
                .HasForeignKey(e => e.DevId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.ApprovedBy)
                .WithMany(u => u.ApprovedPullRequests)
                .HasForeignKey(e => e.ApprovedById)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.Sprint)
                .WithMany(s => s.PullRequests)
                .HasForeignKey(e => e.SprintId)
                .OnDelete(DeleteBehavior.SetNull);
        });
        
        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
        });
        
        // Sprint configuration
        modelBuilder.Entity<Sprint>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });
        
        // AutomationConfig configuration
        modelBuilder.Entity<AutomationConfig>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Key).IsUnique();
            entity.Property(e => e.Key).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Value).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
        });
        
        // Seed initial data
        SeedData(modelBuilder);
    }
    
    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed users (passwords are "password123" hashed with BCrypt)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Rodrigo Barbosa",
                Email = "rodrigo.barbosa@company.com",
                PasswordHash = "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7", // password123
                Role = Domain.Enums.UserRole.Dev,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 2,
                Name = "Itallo Cerqueira",
                Email = "itallo.cerqueira@company.com",
                PasswordHash = "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7",
                Role = Domain.Enums.UserRole.Dev,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 3,
                Name = "Marcos Paulo",
                Email = "marcos.paulo@company.com",
                PasswordHash = "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7",
                Role = Domain.Enums.UserRole.Dev,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 4,
                Name = "Samuel Santos",
                Email = "samuel.santos@company.com",
                PasswordHash = "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7",
                Role = Domain.Enums.UserRole.Gestor,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 5,
                Name = "Kemilly Alvez",
                Email = "kemilly.alvez@company.com",
                PasswordHash = "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7",
                Role = Domain.Enums.UserRole.QA,
                CreatedAt = DateTime.UtcNow
            }
        );
        
        // Seed current sprint
        modelBuilder.Entity<Sprint>().HasData(
            new Sprint
            {
                Id = 1,
                Name = "Sprint 27",
                StartDate = new DateTime(2026, 1, 20),
                EndDate = new DateTime(2026, 2, 3),
                IsActive = true
            }
        );
        
        // Seed automation configs
        modelBuilder.Entity<AutomationConfig>().HasData(
            new AutomationConfig
            {
                Id = 1,
                Key = AutomationConfig.Keys.GitHubToken,
                Value = "",
                Description = "GitHub API token for repository operations",
                IsEncrypted = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new AutomationConfig
            {
                Id = 2,
                Key = AutomationConfig.Keys.GitLabUrl,
                Value = "https://gitlab.com",
                Description = "GitLab base URL",
                IsEncrypted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new AutomationConfig
            {
                Id = 3,
                Key = AutomationConfig.Keys.GitLabToken,
                Value = "",
                Description = "GitLab API token for creating issues",
                IsEncrypted = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new AutomationConfig
            {
                Id = 4,
                Key = AutomationConfig.Keys.GitLabProjectId,
                Value = "",
                Description = "GitLab project ID for issue creation",
                IsEncrypted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );
    }
}
