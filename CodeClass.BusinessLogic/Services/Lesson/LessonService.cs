using CodeClass.BusinessLogic.Mapper.LessonMapper;
using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CodeClass.BusinessLogic.Services.Lesson;

public class LessonService(CodeClassDbContext context) : ILessonService
{
    public async Task<IEnumerable<LessonDto>> GetAllAsync()
    {
        var lessons = await context.Lessons.ToListAsync();
        return lessons.Select(l => l.ToDto());
    }

    public async Task<LessonDto> GetAsync(int lessonId)
    {
        var lesson = await context.Lessons.FindAsync(lessonId) ?? throw new Exception("Lesson not found");
        return lesson.ToDto();
    }

    public async Task<IdentityResult> CreateAsync(LessonDto lesson)
    {
        var newLesson = lesson.ToEntity();
        try
        {
            await context.Lessons.AddAsync(newLesson);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "LessonCreationFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> UpdateAsync(LessonDto lesson)
    {
        var oldLesson = await context.Lessons.FindAsync(lesson.Id);
        if (oldLesson == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "LessonNotFound",
                Description = "Lesson not found"
            });
        }

        oldLesson.Name = lesson.Name;
        oldLesson.Description = lesson.Description;

        try
        {
            context.Lessons.Update(oldLesson);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "LessonUpdateFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAsync(int lessonId)
    {
        var lesson = await context.Lessons.FindAsync(lessonId);
        if (lesson == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "LessonNotFound",
                Description = "Lesson not found"
            });
        }

        try
        {
            context.Lessons.Remove(lesson);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "LessonDeletionFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }
}