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
    public DbSet<VersionBatch> VersionBatches { get; set; } = null!;
    
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

            entity.HasOne(e => e.VersionBatchRef)
                .WithMany(v => v.PullRequests)
                .HasForeignKey(e => e.VersionBatchRefId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // VersionBatch configuration
        modelBuilder.Entity<VersionBatch>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.BatchId).IsUnique();
            entity.Property(e => e.Project).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Version).HasMaxLength(50);
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
            entity.Property(e => e.GithubToken).IsRequired().HasMaxLength(255);
            entity.Property(e => e.GitlabToken).IsRequired().HasMaxLength(255);
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
        
        // Seed automation configs
        modelBuilder.Entity<AutomationConfig>().HasData(
            new AutomationConfig
            {
                Id = 1,
                GithubToken = "",
                GitlabToken = "",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );
    }
}
