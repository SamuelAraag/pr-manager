using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PRManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSecretPasswordToConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SecretPassword",
                table: "AutomationConfigs",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "SecretPassword", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 1, 11, 45, 39, 329, DateTimeKind.Utc).AddTicks(9020), "", new DateTime(2026, 2, 1, 11, 45, 39, 329, DateTimeKind.Utc).AddTicks(9020) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 45, 39, 329, DateTimeKind.Utc).AddTicks(8890));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 45, 39, 329, DateTimeKind.Utc).AddTicks(8890));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 45, 39, 329, DateTimeKind.Utc).AddTicks(8890));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 45, 39, 329, DateTimeKind.Utc).AddTicks(8890));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 1, 11, 45, 39, 329, DateTimeKind.Utc).AddTicks(8890));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SecretPassword",
                table: "AutomationConfigs");

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
    }
}
