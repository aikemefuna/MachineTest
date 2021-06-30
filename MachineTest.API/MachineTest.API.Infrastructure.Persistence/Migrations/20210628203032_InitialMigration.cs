using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace MachineTest.API.Infrastructure.Persistence.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "Master_Sales",
                columns: table => new
                {
                    SalesRef = table.Column<string>(nullable: false),
                    CustomerName = table.Column<string>(nullable: true),
                    CountryCode = table.Column<string>(unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    RegionCode = table.Column<string>(unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    CityCode = table.Column<int>(unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    TransactionDate = table.Column<DateTime>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    Quantity = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Master_Sales", x => x.SalesRef);
                    table.ForeignKey(
                        name: "FK_Master_Sales_Master_City",
                        column: x => x.CityCode,
                        principalTable: "Master_City",
                        principalColumn: "CityCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Master_Sales_Master_Country",
                        column: x => x.CountryCode,
                        principalTable: "Master_Country",
                        principalColumn: "CountryCode",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Master_Sales_Master_Product",
                        column: x => x.ProductId,
                        principalTable: "Master_Product",
                        principalColumn: "ProductID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Master_Sales_Master_Region",
                        column: x => x.RegionCode,
                        principalTable: "Master_Region",
                        principalColumn: "RegionCode",
                        onDelete: ReferentialAction.Restrict);
                });



            migrationBuilder.CreateIndex(
                name: "IX_Master_Sales_CityCode",
                table: "Master_Sales",
                column: "CityCode");

            migrationBuilder.CreateIndex(
                name: "IX_Master_Sales_CountryCode",
                table: "Master_Sales",
                column: "CountryCode");

            migrationBuilder.CreateIndex(
                name: "IX_Master_Sales_ProductId",
                table: "Master_Sales",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Master_Sales_RegionCode",
                table: "Master_Sales",
                column: "RegionCode");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Master_Sales");


        }
    }
}
