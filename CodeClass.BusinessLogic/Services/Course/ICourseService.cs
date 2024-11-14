using System.Security.Claims;
using CodeClass.BusinessLogic.Models.Course;
using CodeClass.BusinessLogic.Services.CrudService;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.Course;

public interface ICourseService : ICrudService<CourseDto>
{
}