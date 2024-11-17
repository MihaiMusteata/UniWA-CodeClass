using CodeClass.BusinessLogic.Models.Course;
using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Services.CrudService;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.Course;

public interface ICourseService : ICrudService<CourseDto>
{
    Task<IEnumerable<CourseDto>> GetTeacherCoursesAsync(string teacherId);
    Task<IEnumerable<LessonDto>> GetCourseLessonsAsync(int courseId);
    Task<IdentityResult> EnrollStudentAsync(string studentId, int courseId);
    Task<IEnumerable<CoursePreviewDto>> GetStudentCoursesAsync(string studentId);
}