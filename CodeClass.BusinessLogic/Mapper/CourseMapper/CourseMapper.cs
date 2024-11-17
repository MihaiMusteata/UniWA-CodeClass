using CodeClass.BusinessLogic.Models.Course;
using CodeClass.Domain.Tables.Course;

namespace CodeClass.BusinessLogic.Mapper.CourseMapper;

public static class CourseMapper
{
    public static CourseDto ToDto(this CourseData courseData)
    {
        return new CourseDto
        {
            Id = courseData.Id,
            Name = courseData.Name,
            Category = courseData.Category
        };
    }

    public static CourseData ToEntity(this CourseDto courseDto)
    {
        return new CourseData
        {
            Id = courseDto.Id,
            Name = courseDto.Name,
            Category = courseDto.Category,
            UserId = courseDto.UserId
        };
    }
    
    public static CoursePreviewDto ToPreviewDto(this CourseData courseData, bool isEnrolled)
    {
        return new CoursePreviewDto
        {
            Id = courseData.Id,
            TeacherName = courseData.Teacher.DisplayName,
            Name = courseData.Name,
            Category = courseData.Category,
            IsEnrolled = isEnrolled
        };
    }
}