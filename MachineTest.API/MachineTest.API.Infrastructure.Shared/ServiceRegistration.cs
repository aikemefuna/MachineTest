using MachineTest.API.Application.Interfaces;
using MachineTest.API.Domain.Settings;
using MachineTest.API.Infrastructure.Shared.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MachineTest.API.Infrastructure.Shared
{
    public static class ServiceRegistration
    {
        public static void AddSharedInfrastructure(this IServiceCollection services, IConfiguration _config)
        {
            services.Configure<MailSettings>(_config.GetSection("MailSettings"));
            services.AddTransient<IDateTimeService, DateTimeService>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<IProductService, ProductService>();
            services.AddTransient<ILocationService, LocationService>();
            services.AddTransient<ISalesService, SalesService>();
        }
    }
}
