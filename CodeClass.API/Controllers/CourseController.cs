using CodeClass.BusinessLogic.Models.Course;
using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Services.Course;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/course")]
[ApiController]
public class CourseController : BaseCrudController<CourseDto>
{
    private readonly ICourseService _courseService;
    public CourseController(ICourseService courseService) : base(courseService)
    {
        _courseService = courseService;
    }
    
    [HttpGet("list/{teacherId}")]
    public async Task<IEnumerable<CourseDto>> GetTeacherCoursesAsync(string teacherId)
    {
        var courses = await _courseService.GetTeacherCoursesAsync(teacherId);
        return courses;
    }
    
    [HttpGet("{courseId}/lessons")]
    public async Task<IEnumerable<LessonDto>> GetCourseLessonsAsync(int courseId)
    {
        var lessons = await _courseService.GetCourseLessonsAsync(courseId);
        return lessons;
    }
}