using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.BusinessLogic.Services.LessonQuiz;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/lesson-quiz")]
[ApiController]
public class LessonQuizController: BaseCrudController<LessonQuizDto>
{
    public LessonQuizController(ILessonQuizService lessonQuizService) : base(lessonQuizService)
    {
    }
}
