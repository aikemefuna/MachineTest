using AutoMapper;
using FluentValidation;
using MachineTest.API.Application.Behaviours;
using MachineTest.API.Application.DapperServices;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace MachineTest.API.Application
{
    public static class ServiceExtensions
    {
        public static void AddApplicationLayer(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            services.AddTransient<IDapper, Dapperr>();
        }
    }
}
