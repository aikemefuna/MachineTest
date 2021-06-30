using Dapper;
using MachineTest.API.Application.Constants;
using MachineTest.API.Application.DapperServices;
using MachineTest.API.Application.DTOs.Location;
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
    public class LocationService : ILocationService
    {
        private string constring;
        IOptions<ConnectionStrings> myconnectionString;
        private readonly IDapper _dapper;
        private readonly LoggerConfiguration _serialLogger = new LoggerConfiguration();
        private readonly ConfigurationBuilder _configBuilder = new ConfigurationBuilder();
        public Logger logger;
        public LocationService(IOptions<ConnectionStrings> connectionString,
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
        public List<CityDTO> GetCitiesByRegionCode(string regionCode)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("Status", Status.GETALL);
                param.Add("RegionCode", regionCode);
                var response = _dapper.GetAll<CityDTO>(ApplicationConstant.SP_City, param, commandType: CommandType.StoredProcedure);
                return response;
            }
            catch (Exception ex)
            {
                logger.Fatal($"An Exception Error as occurred in 'GetCountries' - 'LocationService' with the following details : - {ex.Message}");
                return null;
            }
        }

        public List<CountryDTO> GetCountries()
        {
            try
            {

                var param = new DynamicParameters();
                param.Add("Status", Status.GETALL);
                var response = _dapper.GetAll<CountryDTO>(ApplicationConstant.SP_Country, param, commandType: CommandType.StoredProcedure);
                return response;
            }
            catch (Exception ex)
            {
                logger.Fatal($"An Exception Error as occurred in 'GetCountries' - 'LocationService' with the following details : - {ex.Message}");
                return null;
            }
        }

        public List<RegionDTO> GetRegionsByCountryCode(string countryCode)
        {
            try
            {
                var param = new DynamicParameters();
                param.Add("Status", Status.GETALL);
                param.Add("CountryCode", countryCode);
                var response = _dapper.GetAll<RegionDTO>(ApplicationConstant.SP_Region, param, commandType: CommandType.StoredProcedure);
                return response;
            }
            catch (Exception ex)
            {
                logger.Fatal($"An Exception Error as occurred in 'GetRegionsByCountryCode' - 'LocationService' with the following details : - {ex.Message}");
                return null;
            }
        }
    }
}
