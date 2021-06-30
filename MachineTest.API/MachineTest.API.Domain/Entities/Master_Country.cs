using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MachineTest.API.Domain.Entities
{
    public class Master_Country
    {
        public Master_Country()
        {
            Region = new HashSet<Master_Region>();
            Sales = new HashSet<Master_Sales>();
        }
        [Key]
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public virtual ICollection<Master_Sales> Sales { get; set; }
        public virtual ICollection<Master_Region> Region { get; set; }
    }
}
