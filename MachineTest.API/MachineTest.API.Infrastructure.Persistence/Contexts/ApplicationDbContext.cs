using MachineTest.API.Application.Interfaces;
using MachineTest.API.Domain.Common;
using MachineTest.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MachineTest.API.Infrastructure.Persistence.Contexts
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IDateTimeService _dateTime;
        private readonly IAuthenticatedUserService _authenticatedUser;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IDateTimeService dateTime, IAuthenticatedUserService authenticatedUser) : base(options)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            _dateTime = dateTime;
            _authenticatedUser = authenticatedUser;
        }



        public virtual DbSet<Master_City> Master_City { get; set; }
        public virtual DbSet<Master_Country> Master_Country { get; set; }
        public virtual DbSet<Master_Product> Master_Product { get; set; }
        public virtual DbSet<Master_Region> Master_Region { get; set; }
        public virtual DbSet<Master_Sales> Master_Sales { get; set; }



        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            foreach (var entry in ChangeTracker.Entries<AuditableBaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.Created = _dateTime.NowUtc;
                        entry.Entity.CreatedBy = _authenticatedUser.UserId;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModified = _dateTime.NowUtc;
                        entry.Entity.LastModifiedBy = _authenticatedUser.UserId;
                        break;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            //All Decimals will have 18,6 Range
            foreach (var property in builder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetColumnType("decimal(18,6)");
            }

            builder.Entity<Master_City>(entity =>
            {
                entity.HasKey(e => e.CityCode);

                entity.ToTable("Master_City");

                entity.Property(e => e.CityCode).ValueGeneratedNever();

                entity.Property(e => e.CityName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.RegionCode)
                    .IsRequired()
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.HasOne(d => d.Region)
                    .WithMany(p => p.City)
                    .HasForeignKey(d => d.RegionCode)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Master_City_Master_Region");
            });

            builder.Entity<Master_Sales>(entity =>
            {
                entity.HasKey(e => e.SalesRef);

                entity.ToTable("Master_Sales");

                entity.Property(e => e.SalesRef).ValueGeneratedNever();


                entity.Property(e => e.RegionCode)
                 .IsRequired()
                 .HasMaxLength(3)
                 .IsUnicode(false)
                 .IsFixedLength();

                entity.Property(e => e.CityCode)
                 .IsRequired()
                 .HasMaxLength(3)
                 .IsUnicode(false)
                 .IsFixedLength();
                entity.Property(e => e.CountryCode)
                 .IsRequired()
                 .HasMaxLength(3)
                 .IsUnicode(false)
                 .IsFixedLength();

                entity.HasOne(d => d.Region)
                    .WithMany(p => p.Sales)
                    .HasForeignKey(d => d.RegionCode)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Master_Sales_Master_Region");

                entity.HasOne(d => d.Product)
                   .WithMany(p => p.Sales)
                   .HasForeignKey(d => d.ProductId)
                   .OnDelete(DeleteBehavior.ClientSetNull)
                   .HasConstraintName("FK_Master_Sales_Master_Product");

                entity.HasOne(d => d.City)
                 .WithMany(p => p.Sales)
                 .HasForeignKey(d => d.CityCode)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_Master_Sales_Master_City");

                entity.HasOne(d => d.Country)
                 .WithMany(p => p.Sales)
                 .HasForeignKey(d => d.CountryCode)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_Master_Sales_Master_Country");
            });

            builder.Entity<Master_Country>(entity =>
            {
                entity.HasKey(e => e.CountryCode);

                entity.ToTable("Master_Country");

                entity.Property(e => e.CountryCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CountryName)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            builder.Entity<Master_Product>(entity =>
            {
                entity.HasKey(e => e.ProductId);

                entity.ToTable("Master_Product");

                entity.Property(e => e.ProductId)
                    .HasColumnName("ProductID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ProductName)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            builder.Entity<Master_Region>(entity =>
            {
                entity.HasKey(e => e.RegionCode);

                entity.ToTable("Master_Region");

                entity.Property(e => e.RegionCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CountryCode)
                    .IsRequired()
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RegionName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.Region)
                    .HasForeignKey(d => d.CountryCode)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Master_Region_Master_Country");
            });
            base.OnModelCreating(builder);
        }
    }
}
