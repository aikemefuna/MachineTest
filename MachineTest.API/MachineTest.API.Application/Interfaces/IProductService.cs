using MachineTest.API.Application.DTOs.Product;
using System.Collections.Generic;

namespace MachineTest.API.Application.Interfaces
{
    public interface IProductService
    {
        List<ProductDTO> GetProducts();
    }
}
