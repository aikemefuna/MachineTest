using System;
using System.ComponentModel.DataAnnotations;

namespace MachineTest.API.Domain.Entities
{
    public class Master_Sales
    {
        [Key]
        public string SalesRef { get; set; }
        public string CustomerName { get; set; }
        public string CountryCode { get; set; }
        public string RegionCode { get; set; }
        public int CityCode { get; set; }
        public DateTime TransactionDate { get; set; }
        public int ProductId { get; set; }
        public double Quantity { get; set; }

        public virtual Master_Country Country { get; set; }
        public virtual Master_City City { get; set; }
        public virtual Master_Region Region { get; set; }
        public virtual Master_Product Product { get; set; }
    }
}
