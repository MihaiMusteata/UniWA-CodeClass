using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Services.Lesson;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/lesson")]
[ApiController]
public class LessonController(ILessonService lessonService) : ControllerBase
{
    [HttpGet("get-all")]
    public async Task<IActionResult> GetLessons()
    {
        var lessons = await lessonService.GetLessons();
        return Ok(lessons);
    }

    [HttpGet("get/{lessonId}")]
    public async Task<IActionResult> GetLesson(int lessonId)
    {
        var lesson = await lessonService.GetLesson(lessonId);
        return Ok(lesson);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateLesson(LessonDto lesson)
    {
        var result = await lessonService.CreateLesson(lesson);
        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest(result.Errors.Select(e => e.Description).Aggregate((a, b) => $"{a}, {b}"));
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateLesson(LessonDto lesson)
    {
        var result = await lessonService.UpdateLesson(lesson);
        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest(result.Errors.Select(e => e.Description).Aggregate((a, b) => $"{a}, {b}"));
    }

    [HttpDelete("delete/{lessonId}")]
    public async Task<IActionResult> DeleteLesson(int lessonId)
    {
        var result = await lessonService.DeleteLesson(lessonId);
        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest(result.Errors.Select(e => e.Description).Aggregate((a, b) => $"{a}, {b}"));
    }
}