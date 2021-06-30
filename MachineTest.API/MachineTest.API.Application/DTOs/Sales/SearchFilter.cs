using System;

namespace MachineTest.API.Application.DTOs.Sales
{
    public class SearchFilter
    {
        public DateTime From { get; set; }
        public DateTime? To { get; set; }
        public string CountryCode { get; set; }
        public string RegionCode { get; set; }
        public string CityCode { get; set; }
    }
}
