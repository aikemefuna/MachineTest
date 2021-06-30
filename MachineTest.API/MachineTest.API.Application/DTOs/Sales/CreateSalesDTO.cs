namespace MachineTest.API.Application.DTOs.Sales
{
    public class CreateSalesDTO
    {
        public string CustomerName { get; set; }
        public string CountryCode { get; set; }
        public string RegionCode { get; set; }
        public string CityCode { get; set; }
        public string ProductId { get; set; }
        public string Quantity { get; set; }
    }
}
