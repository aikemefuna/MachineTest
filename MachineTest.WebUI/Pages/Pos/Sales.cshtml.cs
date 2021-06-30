using HRIS.InventoryManager.DTOs.Base;
using MachineTest.WebUI.Constants;
using MachineTest.WebUI.DTOs.Location;
using MachineTest.WebUI.DTOs.Product;
using MachineTest.WebUI.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MachineTest.WebUI.Pages.Pos
{
    public class SalesModel : PageModel
    {
        private readonly IHttpClientService _httpClientService;
        private readonly ApiSettings _settings;
        public SalesModel(IHttpClientService httpClientService,
                          IOptions<ApiSettings> settings)
        {
            _httpClientService = httpClientService;
            _settings = settings.Value;
        }
        public IEnumerable<CountryDTO> Countries { get; set; }
        public IEnumerable<ProductDTO> Products { get; set; }
        public string CustomerName { get; set; }
        public string CountryCode { get; set; }
        public string RegionCode { get; set; }
        public int CityCode { get; set; }
        public int ProductId { get; set; }
        public double Quantity { get; set; }
        public async Task OnGet()
        {
            Countries = await GetCountryList();
            Products = await GetProductList();
            HttpContext.Session.SetString("BaseUrl", _settings.BaseUrl);
        }

        private async Task<List<CountryDTO>> GetCountryList()
        {
            var result = await _httpClientService.GetAsync<BaseDTO<List<CountryDTO>>>($"{_settings.BaseUrl}{AppConstants.GetCountry}");
            if (result.succeeded)
            {
                return result.data;
            }
            return new List<CountryDTO>();
        }
        private async Task<List<ProductDTO>> GetProductList()
        {
            var result = await _httpClientService.GetAsync<BaseDTO<List<ProductDTO>>>($"{_settings.BaseUrl}{AppConstants.GetProducts}");
            if (result.succeeded)
            {
                return result.data;
            }
            return new List<ProductDTO>();
        }
    }
}
