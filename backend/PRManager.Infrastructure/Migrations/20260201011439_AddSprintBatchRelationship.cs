using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PRManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSprintBatchRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "PullRequests");

            migrationBuilder.DropColumn(
                name: "SprintCompleted",
                table: "PullRequests");

            migrationBuilder.AddColumn<int>(
                name: "SprintId",
                table: "VersionBatches",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 1, 1, 14, 39, 184, DateTimeKind.Utc).AddTicks(2600), new DateTime(2026, 2, 1, 1, 14, 39, 184, DateTimeKind.Utc).AddTicks(2600) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 14, 39, 184, DateTimeKind.Utc).AddTicks(2350));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 14, 39, 184, DateTimeKind.Utc).AddTicks(2360));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 14, 39, 184, DateTimeKind.Utc).AddTicks(2360));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 14, 39, 184, DateTimeKind.Utc).AddTicks(2360));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 14, 39, 184, DateTimeKind.Utc).AddTicks(2360));

            migrationBuilder.CreateIndex(
                name: "IX_VersionBatches_SprintId",
                table: "VersionBatches",
                column: "SprintId");

            migrationBuilder.AddForeignKey(
                name: "FK_VersionBatches_Sprints_SprintId",
                table: "VersionBatches",
                column: "SprintId",
                principalTable: "Sprints",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VersionBatches_Sprints_SprintId",
                table: "VersionBatches");

            migrationBuilder.DropIndex(
                name: "IX_VersionBatches_SprintId",
                table: "VersionBatches");

            migrationBuilder.DropColumn(
                name: "SprintId",
                table: "VersionBatches");

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "PullRequests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SprintCompleted",
                table: "PullRequests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 1, 1, 1, 2, 975, DateTimeKind.Utc).AddTicks(3500), new DateTime(2026, 2, 1, 1, 1, 2, 975, DateTimeKind.Utc).AddTicks(3500) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 1, 2, 975, DateTimeKind.Utc).AddTicks(3370));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 1, 2, 975, DateTimeKind.Utc).AddTicks(3370));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 1, 2, 975, DateTimeKind.Utc).AddTicks(3370));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 1, 2, 975, DateTimeKind.Utc).AddTicks(3370));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 1, 2, 975, DateTimeKind.Utc).AddTicks(3380));
        }
    }
}
