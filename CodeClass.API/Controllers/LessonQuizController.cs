using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.BusinessLogic.Services.LessonQuiz;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/lesson-quiz")]
[ApiController]
public class LessonQuizController: BaseCrudController<LessonQuizDto>
{
    private readonly ILessonQuizService _lessonQuizService;
    public LessonQuizController(ILessonQuizService lessonQuizService) : base(lessonQuizService)
    {
        _lessonQuizService = lessonQuizService;
    }
    
    [HttpGet("{lessonId}/quizzes")]
    public async Task<IEnumerable<LessonQuizDto>> GetLessonQuizzes(int lessonId)
    {
        return await _lessonQuizService.GetLessonQuizzes(lessonId);
    }
    
}
