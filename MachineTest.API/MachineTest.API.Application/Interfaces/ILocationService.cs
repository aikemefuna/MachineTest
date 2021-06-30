using MachineTest.API.Application.DTOs.Location;
using System.Collections.Generic;

namespace MachineTest.API.Application.Interfaces
{
    public interface ILocationService
    {
        List<CountryDTO> GetCountries();
        List<RegionDTO> GetRegionsByCountryCode(string countryCode);
        List<CityDTO> GetCitiesByRegionCode(string regionCode);
    }
}
