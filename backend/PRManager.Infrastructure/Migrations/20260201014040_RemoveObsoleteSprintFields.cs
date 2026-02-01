using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PRManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveObsoleteSprintFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 1, 1, 40, 39, 991, DateTimeKind.Utc).AddTicks(1020), new DateTime(2026, 2, 1, 1, 40, 39, 991, DateTimeKind.Utc).AddTicks(1020) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 40, 39, 991, DateTimeKind.Utc).AddTicks(830));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 40, 39, 991, DateTimeKind.Utc).AddTicks(830));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 40, 39, 991, DateTimeKind.Utc).AddTicks(840));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 40, 39, 991, DateTimeKind.Utc).AddTicks(840));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 1, 40, 39, 991, DateTimeKind.Utc).AddTicks(840));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
