using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PRManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSprintCompletedFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "PullRequests");

            migrationBuilder.DropColumn(
                name: "SprintCompleted",
                table: "PullRequests");

            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8870), new DateTime(2026, 1, 31, 22, 36, 20, 319, DateTimeKind.Utc).AddTicks(8870) });

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
    }
}
