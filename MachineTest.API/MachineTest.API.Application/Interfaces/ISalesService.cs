using MachineTest.API.Application.DTOs.Sales;
using System.Collections.Generic;

namespace MachineTest.API.Application.Interfaces
{
    public interface ISalesService
    {
        List<SalesDTO> FilterSales(SearchFilter searchFilter);
        List<SalesDTO> GetSales();
        int PostSale(CreateSalesDTO obj);
    }
}
