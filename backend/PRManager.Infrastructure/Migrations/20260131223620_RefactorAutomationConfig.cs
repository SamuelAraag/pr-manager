using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PRManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorAutomationConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AutomationConfigs_Key",
                table: "AutomationConfigs");

            migrationBuilder.DeleteData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "Description",
                table: "AutomationConfigs");

            migrationBuilder.DropColumn(
                name: "IsEncrypted",
                table: "AutomationConfigs");

            migrationBuilder.DropColumn(
                name: "Key",
                table: "AutomationConfigs");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "AutomationConfigs");

            migrationBuilder.AddColumn<string>(
                name: "GithubToken",
                table: "AutomationConfigs",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GitlabToken",
                table: "AutomationConfigs",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "GithubToken", "GitlabToken", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8870), "", "", new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8870) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8700));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8710));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8710));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8710));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8710));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GithubToken",
                table: "AutomationConfigs");

            migrationBuilder.DropColumn(
                name: "GitlabToken",
                table: "AutomationConfigs");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AutomationConfigs",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEncrypted",
                table: "AutomationConfigs",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "AutomationConfigs",
                type: "TEXT",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "AutomationConfigs",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Description", "IsEncrypted", "Key", "UpdatedAt", "Value" },
                values: new object[] { new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "GitHub API token for repository operations", true, "GitHub.Token", new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "" });

            migrationBuilder.InsertData(
                table: "AutomationConfigs",
                columns: new[] { "Id", "CreatedAt", "Description", "IsEncrypted", "Key", "UpdatedAt", "Value" },
                values: new object[,]
                {
                    { 2, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "GitLab base URL", false, "GitLab.Url", new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "https://gitlab.com" },
                    { 3, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "GitLab API token for creating issues", true, "GitLab.Token", new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3000), "" },
                    { 4, new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3010), "GitLab project ID for issue creation", false, "GitLab.ProjectId", new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(3010), "" }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 31, 21, 18, 51, 705, DateTimeKind.Utc).AddTicks(1300));

            migrationBuilder.CreateIndex(
                name: "IX_AutomationConfigs_Key",
                table: "AutomationConfigs",
                column: "Key",
                unique: true);
        }
    }
}
