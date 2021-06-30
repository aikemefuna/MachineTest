using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MachineTest.API.Domain.Entities
{
    public class Master_Region
    {
        public Master_Region()
        {
            City = new HashSet<Master_City>();
            Sales = new HashSet<Master_Sales>();
        }
        [Key]
        public string RegionCode { get; set; }
        [ForeignKey("Master_Country")]
        public string CountryCode { get; set; }
        public string RegionName { get; set; }

        public virtual ICollection<Master_City> City { get; set; }
        public virtual ICollection<Master_Sales> Sales { get; set; }
        public virtual Master_Country Country { get; set; }
    }
}

