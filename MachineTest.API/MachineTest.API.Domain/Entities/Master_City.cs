using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MachineTest.API.Domain.Entities
{
    public class Master_City
    {
        public Master_City()
        {
            Sales = new HashSet<Master_Sales>();
        }
        [Key]
        public int CityCode { get; set; }
        [ForeignKey("Master_Region")]
        public string RegionCode { get; set; }
        public string CityName { get; set; }

        public virtual Master_Region Region { get; set; }
        public virtual ICollection<Master_Sales> Sales { get; set; }
    }
}
