using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.Domain.Tables.Answer;

namespace CodeClass.BusinessLogic.Mapper.LessonQuizMapper;

public static class GivenAnswerMapper
{
    
    public static IEnumerable<AnswerGiven> ToEntities(this GivenAnswerDto dto)
    {
        return dto.GivenAnswerIds.Select(id => new AnswerGiven
        {
            LessonQuizId = dto.LessonQuizId,
            AnswerOptionId= id,
            UserId = dto.UserId
        });
    }
}