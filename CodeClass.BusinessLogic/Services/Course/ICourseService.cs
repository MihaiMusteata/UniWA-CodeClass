using System.Security.Claims;
using CodeClass.BusinessLogic.Models.Course;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.Course;

public interface ICourseService
{
    Task<IEnumerable<CourseEntity>> GetCourses();
    Task<CourseEntity> GetCourse(int courseId);
    Task<IdentityResult> CreateCourse(CourseEntity course, ClaimsPrincipal userPrincipal);
    Task<IdentityResult> UpdateCourse(CourseEntity course);
    Task<IdentityResult> DeleteCourse(int courseId);
}