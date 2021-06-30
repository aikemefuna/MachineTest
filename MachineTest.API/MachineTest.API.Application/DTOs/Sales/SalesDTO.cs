using System;

namespace MachineTest.API.Application.DTOs.Sales
{
    public class SalesDTO
    {
        public string SalesRef { get; set; }
        public string CustomerName { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public string RegionCode { get; set; }
        public string RegionName { get; set; }
        public int CityCode { get; set; }
        public string CityName { get; set; }
        public DateTime TransactionDate { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public double Quantity { get; set; }
    }
}
