using System.Security.Claims;
using CodeClass.BusinessLogic.Models.Course;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.Course;

public interface ICourseService
{
    Task<IEnumerable<CourseDto>> GetCourses();
    Task<CourseDto> GetCourse(int courseId);
    Task<IdentityResult> CreateCourse(CourseDto course, ClaimsPrincipal userPrincipal);
    Task<IdentityResult> UpdateCourse(CourseDto course);
    Task<IdentityResult> DeleteCourse(int courseId);
}