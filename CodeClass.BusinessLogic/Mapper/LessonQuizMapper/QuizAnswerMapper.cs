using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.Domain.Tables.Lesson;

namespace CodeClass.BusinessLogic.Mapper.LessonQuizMapper;

public static class QuizAnswerMapper
{
    public static QuizAnswerDto ToDto(this AnswerOption entity)
    {
        return new QuizAnswerDto
        {
            OptionText = entity.OptionText,
            IsCorrect = entity.IsCorrect,
        };
    }

    public static AnswerOption ToEntity(this QuizAnswerDto dto, int quizId)
    {
        return new AnswerOption
        {
            OptionText = dto.OptionText,
            IsCorrect = dto.IsCorrect,
            LessonQuizId = quizId
        };
    }
    
}