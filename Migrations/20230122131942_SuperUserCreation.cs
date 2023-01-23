using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Engineer.Migrations
{
    /// <inheritdoc />
    public partial class SuperUserCreation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SuperUser",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SuperUser",
                table: "Users");
        }
    }
}
