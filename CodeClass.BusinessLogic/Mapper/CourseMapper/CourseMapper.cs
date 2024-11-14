using CodeClass.BusinessLogic.Models.Course;
using CodeClass.Domain.Tables.Course;

namespace CodeClass.BusinessLogic.Mapper.CourseMapper;

public static class CourseMapper
{
    public static CourseEntity ToDto(this CourseData courseData)
    {
        return new CourseEntity
        {
            Id = courseData.Id,
            Name = courseData.Name,
            Category = courseData.Category
        };
    }

    public static CourseData ToEntity(this CourseEntity courseEntity, string userId)
    {
        return new CourseData
        {
            Id = courseEntity.Id,
            Name = courseEntity.Name,
            Category = courseEntity.Category,
            UserId = userId,
        };
    }
}