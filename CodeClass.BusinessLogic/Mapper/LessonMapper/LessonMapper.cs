using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.Domain.Tables.Lesson;

namespace CodeClass.BusinessLogic.Mapper.LessonMapper;

public static class LessonMapper
{
    public static LessonDto ToDto(this LessonData entity)
    {
        return new LessonDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            CourseId = entity.CourseId
        };
    }
    
    public static LessonData ToEntity(this LessonDto dto)
    {
        return new LessonData
        {
            Id = dto.Id,
            Name = dto.Name,
            Description = dto.Description,
            CourseId = dto.CourseId
        };
    }
    
}