using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.BusinessLogic.Services.CrudService;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.LessonQuiz;

public interface ILessonQuizService : ICrudService<LessonQuizDto>
{
    Task<IEnumerable<LessonQuizDto>> GetLessonQuizzes(int lessonId);
    Task<IdentityResult> AnswerQuestion(GivenAnswerDto answerData);
    Task<IEnumerable<QuizAnswerDto>> GetMyAnswers(int lessonQuizId, string userId);
}