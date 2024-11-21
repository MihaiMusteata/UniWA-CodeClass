using CodeClass.BusinessLogic.Mapper.LessonQuizMapper;
using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CodeClass.BusinessLogic.Services.LessonQuiz;

public class LessonQuizService(CodeClassDbContext context) : ILessonQuizService
{
    public async Task<IEnumerable<LessonQuizDto>> GetAllAsync()
    {
        var quizzes = await context.LessonQuizzes
            .Include(q => q.AnswerOptions)
            .ToListAsync();
        return quizzes.Select(q => q.ToDto());
    }

    public async Task<LessonQuizDto> GetAsync(int id)
    {
        var quiz = await context.LessonQuizzes.FindAsync(id) ?? throw new Exception("Quiz not found");
        return quiz.ToDto();
    }

    public async Task<IdentityResult> CreateAsync(LessonQuizDto dto)
    {
        var newQuiz = dto.ToEntity();
        try
        {
            var lessonQuiz = await context.LessonQuizzes.AddAsync(newQuiz);
            await context.SaveChangesAsync();

            var lessonQuizId = lessonQuiz.Entity.Id;

            var answerOptions = dto.Answers.Select(a => a.ToEntity(lessonQuizId));
            await context.AnswerOptions.AddRangeAsync(answerOptions);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "QuizCreationFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> UpdateAsync(LessonQuizDto dto)
    {
        var oldQuiz = await context.LessonQuizzes.FindAsync(dto.Id);
        if (oldQuiz == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "QuizNotFound",
                Description = "Quiz not found"
            });
        }

        oldQuiz.Question = dto.Question;
        oldQuiz.LessonId = dto.LessonId;

        try
        {
            context.LessonQuizzes.Update(oldQuiz);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "QuizUpdateFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAsync(int id)
    {
        var quiz = await context.LessonQuizzes.FindAsync(id);
        if (quiz == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "QuizNotFound",
                Description = "Quiz not found"
            });
        }

        try
        {
            context.LessonQuizzes.Remove(quiz);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "QuizDeletionFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IEnumerable<LessonQuizDto>> GetLessonQuizzes(int lessonId)
    {
        var quizzes = await context.LessonQuizzes
            .Include(q => q.AnswerOptions)
            .Where(q => q.LessonId == lessonId)
            .ToListAsync();
        return quizzes.Select(q => q.ToDto());
    }

    public async Task<IdentityResult> AnswerQuestion(GivenAnswerDto answerData)
    {
        try
        {
            await context.AnswersGiven.AddRangeAsync(answerData.ToEntities());
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "AnswerFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }


    public async Task<IEnumerable<QuizAnswerDto>> GetMyAnswers(int lessonQuizId, string userId)
    {
        var answers = await context.AnswersGiven
            .Include(a => a.AnswerOption)
            .Where(a => a.LessonQuizId == lessonQuizId && a.UserId == userId)
            .Select(a => a.AnswerOption.ToDto())
            .ToListAsync();

        return answers;
    }
}