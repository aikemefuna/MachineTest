using System;
using System.Collections.Generic;
using System.Text;

namespace MachineTest.API.Domain.Common
{
    public abstract class BaseEntity
    {
        public virtual int Id { get; set; }
    }
}
