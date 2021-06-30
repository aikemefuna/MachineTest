using Dapper;
using MachineTest.API.Application.Constants;
using MachineTest.API.Application.DapperServices;
using MachineTest.API.Application.DTOs.Sales;
using MachineTest.API.Application.Enums;
using MachineTest.API.Application.Interfaces;
using MachineTest.API.Domain.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Serilog;
using Serilog.Core;
using System;
using System.Collections.Generic;
using System.Data;

namespace MachineTest.API.Infrastructure.Shared.Services
{
    public class SalesService : ISalesService
    {
        private string constring;
        IOptions<ConnectionStrings> myconnectionString;
        private readonly IDapper _dapper;
        private readonly LoggerConfiguration _serialLogger = new LoggerConfiguration();
        private readonly ConfigurationBuilder _configBuilder = new ConfigurationBuilder();
        public Logger logger;
        public SalesService(IOptions<ConnectionStrings> connectionString,
                               IDapper dapper)
        {
            myconnectionString = connectionString;
            _dapper = dapper;
            constring = myconnectionString.Value.DefaultConnection;

            //Read Configuration from appSettings
            var config = _configBuilder
                .AddJsonFile("appsettings.json")
                .Build();

            //Initialize Logger
            logger = _serialLogger
                .ReadFrom.Configuration(config)
                .CreateLogger();
        }
        public List<SalesDTO> FilterSales(SearchFilter searchFilter)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("Status", Status.Filter);
                param.Add("CountryCode", searchFilter.CountryCode);
                param.Add("RegionCode", searchFilter.RegionCode);
                param.Add("CityCode", searchFilter.CityCode);
                param.Add("From", searchFilter.From);
                param.Add("To", searchFilter.To);
                var response = _dapper.GetAll<SalesDTO>(ApplicationConstant.SP_Sales, param, commandType: CommandType.StoredProcedure);
                return response;
            }
            catch (Exception ex)
            {
                logger.Fatal($"An Exception Error as occurred in 'GetSales' - 'SalesService' with the following details : - {ex.Message}");
                return null;
            }
        }
        public List<SalesDTO> GetSales()
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("Status", Status.GETALL);

                var response = _dapper.GetAll<SalesDTO>(ApplicationConstant.SP_Sales, param, commandType: CommandType.StoredProcedure);
                return response;
            }
            catch (Exception ex)
            {
                logger.Fatal($"An Exception Error as occurred in 'GetSales' - 'SalesService' with the following details : - {ex.Message}");
                return null;
            }
        }

        public int PostSale(CreateSalesDTO obj)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("Status", Status.INSERT);
                param.Add("Quantity", Convert.ToDouble(obj.Quantity));
                param.Add("ProductId", int.Parse(obj.ProductId));
                param.Add("CityCode", int.Parse(obj.CityCode));
                param.Add("RegionCode", obj.RegionCode);
                param.Add("CountryCode", obj.CountryCode);
                param.Add("SalesRef", DateTime.Now.ToString("MMssmmHHddfff"));
                param.Add("CustomerName", obj.CustomerName);
                var response = _dapper.Execute(ApplicationConstant.SP_Sales, param, CommandType.StoredProcedure);
                return response;
            }
            catch (Exception ex)
            {
                logger.Fatal($"An Exception Error as occurred in 'GetSales' - 'SalesService' with the following details : - {ex.Message}");
                return 0;
            }
        }
    }
}
