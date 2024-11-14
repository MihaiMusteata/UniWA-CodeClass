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
    
    [HttpGet("{quizId}/answers")]
    public async Task<IEnumerable<QuizAnswerDto>> GetQuizAnswersAsync(int quizId)
    {
        var answers = await _lessonQuizService.GetQuizAnswersAsync(quizId);
        return answers;
    }
    
    [HttpPost("{quizId}/add-answer")]
    public async Task<IActionResult> AddAnswerAsync(int quizId, QuizAnswerDto answerDto)
    {
        var result = await _lessonQuizService.AddAnswerAsync(quizId, answerDto);
        return result.Succeeded ? Ok() : BadRequest(result.Errors);
    }
    
    [HttpDelete("{quizId}/delete-answer/{answerId}")]
    public async Task<IActionResult> DeleteAnswerAsync(int quizId, int answerId)
    {
        var result = await _lessonQuizService.DeleteAnswerAsync(quizId, answerId);
        return result.Succeeded ? Ok() : BadRequest(result.Errors);
    }
    
    
}
