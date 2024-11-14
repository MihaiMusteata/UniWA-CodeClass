using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Services.Lesson;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/lesson")]
[ApiController]
public class LessonController: BaseCrudController<LessonDto>
{
    public LessonController(ILessonService lessonService) : base(lessonService)
    {
    }
}