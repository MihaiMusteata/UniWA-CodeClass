using CodeClass.BusinessLogic.Models.Course;
using CodeClass.BusinessLogic.Services.Course;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/course")]
[ApiController]
public class CourseController(ICourseService courseService) : ControllerBase
{
    [HttpGet("get-all")]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await courseService.GetCourses();
        return Ok(courses);
    }

    [HttpGet("get/{courseId}")]
    public async Task<IActionResult> GetCourse(int courseId)
    {
        var course = await courseService.GetCourse(courseId);

        return Ok(course);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateCourse(CourseEntity course)
    {
        var result = await courseService.CreateCourse(course, User);
        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest(result.Errors.Select(e => e.Description).Aggregate((a, b) => $"{a}, {b}"));
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateCourse(CourseEntity course)
    {
        var result = await courseService.UpdateCourse(course);
        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest(result.Errors.Select(e => e.Description).Aggregate((a, b) => $"{a}, {b}"));
    }

    [HttpDelete("delete/{courseId}")]
    public async Task<IActionResult> DeleteCourse(int courseId)
    {
        var result = await courseService.DeleteCourse(courseId);
        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest(result.Errors.Select(e => e.Description).Aggregate((a, b) => $"{a}, {b}"));
    }
}