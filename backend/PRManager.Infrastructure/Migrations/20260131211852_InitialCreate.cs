using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PRManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AutomationConfigs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Key = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    IsEncrypted = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutomationConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sprints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sprints", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<int>(type: "INTEGER", nullable: false),
                    GitHubTokenEncrypted = table.Column<string>(type: "TEXT", nullable: true),
                    GitLabTokenEncrypted = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VersionBatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BatchId = table.Column<string>(type: "TEXT", nullable: false),
                    Project = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Version = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    PipelineLink = table.Column<string>(type: "TEXT", nullable: false),
                    Rollback = table.Column<string>(type: "TEXT", nullable: false),
                    GitlabIssueLink = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VersionBatches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PullRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ExternalId = table.Column<string>(type: "TEXT", nullable: false),
                    Project = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Summary = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    DevId = table.Column<int>(type: "INTEGER", nullable: false),
                    PrLink = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    TaskLink = table.Column<string>(type: "TEXT", nullable: true),
                    TeamsLink = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    ReqVersion = table.Column<string>(type: "TEXT", nullable: false),
                    Approved = table.Column<bool>(type: "INTEGER", nullable: false),
                    ApprovedById = table.Column<int>(type: "INTEGER", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NeedsCorrection = table.Column<bool>(type: "INTEGER", nullable: false),
                    CorrectionReason = table.Column<string>(type: "TEXT", nullable: true),
                    VersionRequested = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersionBatchRefId = table.Column<int>(type: "INTEGER", nullable: true),
                    Version = table.Column<string>(type: "TEXT", nullable: true),
                    PipelineLink = table.Column<string>(type: "TEXT", nullable: true),
                    Rollback = table.Column<string>(type: "TEXT", nullable: true),
                    VersionGroupStatus = table.Column<string>(type: "TEXT", nullable: true),
                    GitlabIssueLink = table.Column<string>(type: "TEXT", nullable: true),
                    DeployedToStg = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeployedToStgAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SprintId = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PullRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PullRequests_Sprints_SprintId",
                        column: x => x.SprintId,
                        principalTable: "Sprints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PullRequests_Users_ApprovedById",
                        column: x => x.ApprovedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PullRequests_Users_DevId",
                        column: x => x.DevId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PullRequests_VersionBatches_VersionBatchRefId",
                        column: x => x.VersionBatchRefId,
                        principalTable: "VersionBatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "AutomationConfigs",
                columns: new[] { "Id", "CreatedAt", "Description", "IsEncrypted", "Key", "UpdatedAt", "Value" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "GitHub API token for repository operations", true, "GitHub.Token", new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "" },
                    { 2, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "GitLab base URL", false, "GitLab.Url", new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "https://gitlab.com" },
                    { 3, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "GitLab API token for creating issues", true, "GitLab.Token", new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "" },
                    { 4, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3010), "GitLab project ID for issue creation", false, "GitLab.ProjectId", new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3010), "" }
                });

            migrationBuilder.InsertData(
                table: "Sprints",
                columns: new[] { "Id", "EndDate", "IsActive", "Name", "StartDate" },
                values: new object[] { 1, new DateTime(2026, 2, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), true, "Sprint 27", new DateTime(2026, 1, 20, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "GitHubTokenEncrypted", "GitLabTokenEncrypted", "LastLoginAt", "Name", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300), "rodrigo.barbosa@company.com", null, null, null, "Rodrigo Barbosa", "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7", 1 },
                    { 2, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300), "itallo.cerqueira@company.com", null, null, null, "Itallo Cerqueira", "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7", 1 },
                    { 3, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300), "marcos.paulo@company.com", null, null, null, "Marcos Paulo", "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7", 1 },
                    { 4, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300), "samuel.santos@company.com", null, null, null, "Samuel Santos", "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7", 3 },
                    { 5, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300), "kemilly.alvez@company.com", null, null, null, "Kemilly Alvez", "$2a$11$XZvCfQqmJQZJZQZJZQZJZu7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AutomationConfigs_Key",
                table: "AutomationConfigs",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PullRequests_ApprovedById",
                table: "PullRequests",
                column: "ApprovedById");

            migrationBuilder.CreateIndex(
                name: "IX_PullRequests_DevId",
                table: "PullRequests",
                column: "DevId");

            migrationBuilder.CreateIndex(
                name: "IX_PullRequests_ExternalId",
                table: "PullRequests",
                column: "ExternalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PullRequests_SprintId",
                table: "PullRequests",
                column: "SprintId");

            migrationBuilder.CreateIndex(
                name: "IX_PullRequests_VersionBatchRefId",
                table: "PullRequests",
                column: "VersionBatchRefId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VersionBatches_BatchId",
                table: "VersionBatches",
                column: "BatchId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AutomationConfigs");

            migrationBuilder.DropTable(
                name: "PullRequests");

            migrationBuilder.DropTable(
                name: "Sprints");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "VersionBatches");
        }
    }
}
