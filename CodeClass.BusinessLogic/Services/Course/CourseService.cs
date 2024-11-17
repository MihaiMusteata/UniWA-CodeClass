using CodeClass.BusinessLogic.Mapper.CourseMapper;
using CodeClass.BusinessLogic.Mapper.LessonMapper;
using CodeClass.BusinessLogic.Models.Course;
using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CodeClass.BusinessLogic.Services.Course;

public class CourseService(CodeClassDbContext context) : ICourseService
{
    public async Task<IEnumerable<CourseDto>> GetAllAsync()
    {
        var courses = await context.Courses.ToListAsync();
        return courses.Select(c => c.ToDto());
    }

    public async Task<CourseDto> GetAsync(int courseId)
    {
        var course = await context.Courses.FindAsync(courseId) ?? throw new Exception("Course not found");
        return course.ToDto();
    }

    public async Task<IdentityResult> CreateAsync(CourseDto course)
    {
        var newCourse = course.ToEntity();
        try
        {
            await context.Courses.AddAsync(newCourse);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseCreationFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> UpdateAsync(CourseDto course)
    {
        var oldCourse = await context.Courses.FindAsync(course.Id);
        if (oldCourse == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseNotFound",
                Description = "Course not found"
            });
        }

        oldCourse.Name = course.Name;
        oldCourse.Category = course.Category;

        try
        {
            context.Courses.Update(oldCourse);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseUpdateFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAsync(int courseId)
    {
        var course = await context.Courses.FindAsync(courseId);
        if (course == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseNotFound",
                Description = "Course not found"
            });
        }

        try
        {
            context.Courses.Remove(course);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseDeletionFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IEnumerable<CourseDto>> GetTeacherCoursesAsync(string teacherId)
    {
        var courses = await context.Courses
            .Where(c => c.UserId == teacherId)
            .Select(c => c.ToDto())
            .ToListAsync();
        
        courses.ForEach(c => c.TotalLessons = context.Lessons.Count(l => l.CourseId == c.Id));
        courses.ForEach(c => c.EnrolledStudents = context.Enrollments.Count(e => e.CourseId == c.Id));

        return courses;
    }
    
    public async Task <IEnumerable<LessonDto>> GetCourseLessonsAsync(int courseId)
    {
        var lessons = await context.Lessons
            .Where(l => l.CourseId == courseId)
            .Select(l => l.ToDto())
            .ToListAsync();

        return lessons;
    }
}