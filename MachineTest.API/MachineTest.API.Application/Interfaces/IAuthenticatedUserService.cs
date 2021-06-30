using System;
using System.Collections.Generic;
using System.Text;

namespace MachineTest.API.Application.Interfaces
{
    public interface IAuthenticatedUserService
    {
        string UserId { get; }
    }
}
