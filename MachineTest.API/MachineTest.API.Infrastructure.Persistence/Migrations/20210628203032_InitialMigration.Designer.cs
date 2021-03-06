// <auto-generated />
using System;
using MachineTest.API.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MachineTest.API.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20210628203032_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MachineTest.API.Domain.Entities.Master_City", b =>
                {
                    b.Property<int>("CityCode")
                        .HasColumnType("int");

                    b.Property<string>("CityName")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)")
                        .HasMaxLength(255);

                    b.Property<string>("RegionCode")
                        .IsRequired()
                        .HasColumnType("char(3)")
                        .IsFixedLength(true)
                        .HasMaxLength(3)
                        .IsUnicode(false);

                    b.HasKey("CityCode");

                    b.HasIndex("RegionCode");

                    b.ToTable("Master_City");
                });

            modelBuilder.Entity("MachineTest.API.Domain.Entities.Master_Country", b =>
                {
                    b.Property<string>("CountryCode")
                        .HasColumnType("char(3)")
                        .IsFixedLength(true)
                        .HasMaxLength(3)
                        .IsUnicode(false);

                    b.Property<string>("CountryName")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)")
                        .HasMaxLength(255);

                    b.HasKey("CountryCode");

                    b.ToTable("Master_Country");
                });

            modelBuilder.Entity("MachineTest.API.Domain.Entities.Master_Product", b =>
                {
                    b.Property<int>("ProductId")
                        .HasColumnName("ProductID")
                        .HasColumnType("int");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<string>("ProductName")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)")
                        .HasMaxLength(255);

                    b.HasKey("ProductId");

                    b.ToTable("Master_Product");
                });

            modelBuilder.Entity("MachineTest.API.Domain.Entities.Master_Region", b =>
                {
                    b.Property<string>("RegionCode")
                        .HasColumnType("char(3)")
                        .IsFixedLength(true)
                        .HasMaxLength(3)
                        .IsUnicode(false);

                    b.Property<string>("CountryCode")
                        .IsRequired()
                        .HasColumnType("char(3)")
                        .IsFixedLength(true)
                        .HasMaxLength(3)
                        .IsUnicode(false);

                    b.Property<string>("RegionName")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)")
                        .HasMaxLength(255);

                    b.HasKey("RegionCode");

                    b.HasIndex("CountryCode");

                    b.ToTable("Master_Region");
                });

            modelBuilder.Entity("MachineTest.API.Domain.Entities.Master_Sales", b =>
                {
                    b.Property<string>("SalesRef")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("CityCode")
                        .HasColumnType("int")
                        .IsFixedLength(true)
                        .HasMaxLength(3)
                        .IsUnicode(false);

                    b.Property<string>("CountryCode")
                        .IsRequired()
                        .HasColumnType("char(3)")
                        .IsFixedLength(true)
                        .HasMaxLength(3)
                        .IsUnicode(false);

                    b.Property<string>("CustomerName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.Property<double>("Quantity")
                        .HasColumnType("float");

                    b.Property<string>("RegionCode")
                        .IsRequired()
                        .HasColumnType("char(3)")
                        .IsFixedLength(true)
                        .HasMaxLength(3)
                        .IsUnicode(false);

                    b.Property<DateTime>("TransactionDate")
                        .HasColumnType("datetime2");

                    b.HasKey("SalesRef");

                    b.HasIndex("CityCode");

                    b.HasIndex("CountryCode");

                    b.HasIndex("ProductId");

                    b.HasIndex("RegionCode");

                    b.ToTable("Master_Sales");
                });

            modelBuilder.Entity("MachineTest.API.Domain.Entities.Master_City", b =>
                {
                    b.HasOne("MachineTest.API.Domain.Entities.Master_Region", "Region")
                        .WithMany("City")
                        .HasForeignKey("RegionCode")
                        .HasConstraintName("FK_Master_City_Master_Region")
                        .IsRequired();
                });

            modelBuilder.Entity("MachineTest.API.Domain.Entities.Master_Region", b =>
                {
                    b.HasOne("MachineTest.API.Domain.Entities.Master_Country", "Country")
                        .WithMany("Region")
                        .HasForeignKey("CountryCode")
                        .HasConstraintName("FK_Master_Region_Master_Country")
                        .IsRequired();
                });

            modelBuilder.Entity("MachineTest.API.Domain.Entities.Master_Sales", b =>
                {
                    b.HasOne("MachineTest.API.Domain.Entities.Master_City", "City")
                        .WithMany("Sales")
                        .HasForeignKey("CityCode")
                        .HasConstraintName("FK_Master_Sales_Master_City")
                        .IsRequired();

                    b.HasOne("MachineTest.API.Domain.Entities.Master_Country", "Country")
                        .WithMany("Sales")
                        .HasForeignKey("CountryCode")
                        .HasConstraintName("FK_Master_Sales_Master_Country")
                        .IsRequired();

                    b.HasOne("MachineTest.API.Domain.Entities.Master_Product", "Product")
                        .WithMany("Sales")
                        .HasForeignKey("ProductId")
                        .HasConstraintName("FK_Master_Sales_Master_Product")
                        .IsRequired();

                    b.HasOne("MachineTest.API.Domain.Entities.Master_Region", "Region")
                        .WithMany("Sales")
                        .HasForeignKey("RegionCode")
                        .HasConstraintName("FK_Master_Sales_Master_Region")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
