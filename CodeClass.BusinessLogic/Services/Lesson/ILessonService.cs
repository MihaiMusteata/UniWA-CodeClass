using CodeClass.BusinessLogic.Models.Lesson;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.Lesson;

public interface ILessonService
{
    Task<IEnumerable<LessonDto>> GetLessons();
    Task<LessonDto> GetLesson(int lessonId);
    Task<IdentityResult> CreateLesson(LessonDto lesson);
    Task<IdentityResult> UpdateLesson(LessonDto lesson);
    Task<IdentityResult> DeleteLesson(int lessonId);
}