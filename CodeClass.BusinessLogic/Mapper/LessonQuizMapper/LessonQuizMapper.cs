using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.Domain.Tables.Lesson;

namespace CodeClass.BusinessLogic.Mapper.LessonQuizMapper;

public static class LessonQuizMapper
{
    public static LessonQuizDto ToDto(this LessonQuiz entity)
    {
        return new LessonQuizDto
        {
            Id = entity.Id,
            Question = entity.Question,
            LessonId = entity.LessonId
        };
    }

    public static LessonQuiz ToEntity(this LessonQuizDto dto)
    {
        return new LessonQuiz
        {
            Id = dto.Id,
            Question = dto.Question,
            LessonId = dto.LessonId
        };
    }
    
}