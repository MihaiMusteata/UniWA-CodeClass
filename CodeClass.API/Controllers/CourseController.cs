using CodeClass.BusinessLogic.Models.Course;
using CodeClass.BusinessLogic.Services.Course;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/course")]
[ApiController]
public class CourseController : BaseCrudController<CourseDto>
{
    public CourseController(ICourseService courseService) : base(courseService)
    {
    }
}