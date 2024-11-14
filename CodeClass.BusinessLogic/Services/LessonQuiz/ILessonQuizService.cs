using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.BusinessLogic.Services.CrudService;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.LessonQuiz;

public interface ILessonQuizService : ICrudService<LessonQuizDto>
{
    Task<IEnumerable<QuizAnswerDto>> GetQuizAnswersAsync(int quizId);
    Task<IdentityResult> AddAnswerAsync(int quizId, QuizAnswerDto answerDto);
    Task<IdentityResult> DeleteAnswerAsync(int quizId, int answerId);
    
}