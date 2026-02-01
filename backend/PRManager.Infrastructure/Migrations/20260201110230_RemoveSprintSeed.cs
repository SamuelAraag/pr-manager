using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PRManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSprintSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 1, 11, 2, 30, 575, DateTimeKind.Utc).AddTicks(1490), new DateTime(2026, 2, 1, 11, 2, 30, 575, DateTimeKind.Utc).AddTicks(1490) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 2, 30, 575, DateTimeKind.Utc).AddTicks(1300));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 2, 30, 575, DateTimeKind.Utc).AddTicks(1300));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 2, 30, 575, DateTimeKind.Utc).AddTicks(1300));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 2, 30, 575, DateTimeKind.Utc).AddTicks(1310));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 2, 30, 575, DateTimeKind.Utc).AddTicks(1310));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4980), new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4980) });

            migrationBuilder.InsertData(
                table: "Sprints",
                columns: new[] { "Id", "EndDate", "IsActive", "Name", "StartDate" },
                values: new object[] { 1, new DateTime(2026, 2, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), true, "Sprint 27", new DateTime(2026, 1, 20, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4510));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4510));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4540));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4540));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4550));
        }
    }
}
