using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PRManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeSprintDatesNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "Sprints",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "Sprints",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "TEXT");

            migrationBuilder.UpdateData(
                table: "AutomationConfigs",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4980), new DateTime(2026, 2, 1, 10, 52, 8, 916, DateTimeKind.Utc).AddTicks(4980) });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "Sprints",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "Sprints",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldNullable: true);

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
    }
}
