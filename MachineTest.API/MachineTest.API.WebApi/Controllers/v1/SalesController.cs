using DevExtreme.AspNet.Data;
using MachineTest.API.Application.DTOs.Location;
using MachineTest.API.Application.DTOs.Product;
using MachineTest.API.Application.DTOs.Sales;
using MachineTest.API.Application.Helper;
using MachineTest.API.Application.Interfaces;
using MachineTest.API.Application.Wrappers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MachineTest.API.WebApi.Controllers.v1
{
    [ApiVersion("1.0")]
    public class SalesController : BaseApiController
    {
        private readonly ISalesService _salesService;
        private readonly ILocationService _locationService;
        private readonly IProductService _productService;

        public SalesController(ISalesService salesService,
                               ILocationService locationService,
                               IProductService productService)
        {
            _salesService = salesService;
            _locationService = locationService;
            _productService = productService;
        }
        [HttpGet("get-all-sales")]
        [ProducesResponseType(typeof(Response<List<SalesDTO>>), 200)]
        public IActionResult GetSales(DataSourceLoadOptions loadOptions)
        {
            var from = Request.Headers["from"].ToString();
            var to = Request.Headers["to"].ToString();
            var countryCode = Request.Headers["countryCodeFilter"].ToString();
            var regionCode = Request.Headers["regionCodeFilter"].ToString();
            var cityCode = Request.Headers["cityCodeFilter"].ToString();
            var result = new List<SalesDTO>();
            if (countryCode != "" || regionCode != "" || cityCode != "" || from != "" || to != "")
            {
                var filter = new SearchFilter
                {
                    CityCode = cityCode,
                    CountryCode = countryCode,
                    From = from != "" ? Convert.ToDateTime(from) : new DateTime(),
                    RegionCode = regionCode,
                    To = to != "" ? Convert.ToDateTime(to) : new DateTime()
                };
                result = _salesService.FilterSales(filter);
            }
            else
            {
                result = _salesService.GetSales();
            }

            var response = new Response<List<SalesDTO>>();
            if (result != null)
            {

                try
                {
                    response.Data = result;
                    response.Message = "Sales list was retrieved successfully";
                    response.Succeeded = true;

                    loadOptions.PrimaryKey = new[] { $"salesRef" };
                    return Ok(DataSourceLoader.Load(response.Data.OrderBy(x => x.CustomerName), loadOptions));
                }
                catch (Exception ex)
                {
                    Console.Write(ex.Message);
                }
            }
            response.Data = new List<SalesDTO>();
            response.Message = "Failed to retrive sales";
            response.Succeeded = false;
            return Ok(DataSourceLoader.Load(response.Data.OrderBy(x => x.CustomerName), loadOptions));
        }

        [HttpGet("get-countries")]
        [ProducesResponseType(typeof(Response<List<CountryDTO>>), 200)]
        public IActionResult GetCountries()
        {
            var result = _locationService.GetCountries();
            var response = new Response<List<CountryDTO>>
            {
                Data = result,
                Succeeded = result != null ? true : false,
                Message = result != null ? "country list retrieved successful" : "failed to retrieve country list"
            };

            return Ok(response);
        }
        [HttpGet("get-region/{countryCode}")]
        [ProducesResponseType(typeof(Response<List<RegionDTO>>), 200)]
        public IActionResult GetRegionByCountryCode(string countryCode)
        {
            var result = _locationService.GetRegionsByCountryCode(countryCode);
            var response = new Response<List<RegionDTO>>
            {
                Data = result,
                Succeeded = result != null ? true : false,
                Message = result != null ? "regions retrieved successful" : "failed to retrieve region list"
            };

            return Ok(response);
        }
        [HttpGet("get-city/{regionCode}")]
        [ProducesResponseType(typeof(Response<List<CityDTO>>), 200)]
        public IActionResult GetCityByRegionCode(string regionCode)
        {
            var result = _locationService.GetCitiesByRegionCode(regionCode);
            var response = new Response<List<CityDTO>>
            {
                Data = result,
                Succeeded = result != null ? true : false,
                Message = result != null ? "cities retrieved successful" : "failed to retrieve city list"
            };

            return Ok(response);
        }


        [HttpGet("get-product")]
        [ProducesResponseType(typeof(Response<List<ProductDTO>>), 200)]
        public IActionResult GetProducts()
        {
            var result = _productService.GetProducts();
            var response = new Response<List<ProductDTO>>
            {
                Data = result,
                Succeeded = result != null ? true : false,
                Message = result != null ? "product retrieved successful" : "failed to retrieve product"
            };

            return Ok(response);
        }


        [HttpPost("post-sale")]
        [ProducesResponseType(typeof(Response<string>), 200)]
        public IActionResult PostSale([FromBody] CreateSalesDTO request)
        {
            var result = _salesService.PostSale(request);
            var response = new Response<string>
            {
                Data = "sales posted successfully",
                Succeeded = result > 0 ? true : false,
                Message = result > 0 ? "sales posted successful" : "failed to post sales"
            };

            return Ok(response);
        }

    }
}
