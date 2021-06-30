using Dapper;
using MachineTest.API.Application.Constants;
using MachineTest.API.Application.DapperServices;
using MachineTest.API.Application.DTOs.Product;
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
    public class ProductService : IProductService
    {
        private string constring;
        IOptions<ConnectionStrings> myconnectionString;
        private readonly IDapper _dapper;
        private readonly LoggerConfiguration _serialLogger = new LoggerConfiguration();
        private readonly ConfigurationBuilder _configBuilder = new ConfigurationBuilder();
        public Logger logger;
        public ProductService(IOptions<ConnectionStrings> connectionString,
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
        public List<ProductDTO> GetProducts()
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("Status", Status.GETALL);
                var response = _dapper.GetAll<ProductDTO>(ApplicationConstant.SP_Product, param, commandType: CommandType.StoredProcedure);
                return response;
            }
            catch (Exception ex)
            {
                logger.Fatal($"An Exception Error as occurred in 'GetCountries' - 'LocationService' with the following details : - {ex.Message}");
                return null;
            }
        }
    }
}
