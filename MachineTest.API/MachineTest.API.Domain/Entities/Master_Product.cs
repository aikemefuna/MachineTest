using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MachineTest.API.Domain.Entities
{
    public class Master_Product
    {
        public Master_Product()
        {
            Sales = new HashSet<Master_Sales>();
        }
        [Key]
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public virtual ICollection<Master_Sales> Sales { get; set; }
    }
}
