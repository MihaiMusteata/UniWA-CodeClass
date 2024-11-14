using CodeClass.BusinessLogic.Mapper.LessonQuizMapper;
using CodeClass.BusinessLogic.Models.LessonQuiz;
using CodeClass.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CodeClass.BusinessLogic.Services.LessonQuiz;

public class LessonQuizService(CodeClassDbContext context)  : ILessonQuizService
{
    public async Task<IEnumerable<LessonQuizDto>> GetAllAsync()
    {
        var quizzes = await context.LessonQuizzes.ToListAsync();
        return quizzes.Select(l => l.ToDto());
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
            await context.LessonQuizzes.AddAsync(newQuiz);
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

    public async Task<IEnumerable<QuizAnswerDto>> GetQuizAnswersAsync(int quizId)
    {
        var quiz = await context.LessonQuizzes
            .Include(q => q.AnswerOptions)
            .FirstOrDefaultAsync(q => q.Id == quizId);
        if (quiz == null)
        {
            throw new Exception("Quiz not found");
        }
        
        return quiz.AnswerOptions.Select(a => a.ToDto());
    }

    public async Task<IdentityResult> AddAnswerAsync(int quizId, QuizAnswerDto answerDto)
    {
        var quiz = await context.LessonQuizzes.FindAsync(quizId);
        if (quiz == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "QuizNotFound",
                Description = "Quiz not found"
            });
        }

        var answer = answerDto.ToEntity(quizId);
        try
        {
            await context.AnswerOptions.AddAsync(answer);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "AnswerCreationFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAnswerAsync(int quizId, int answerId)
    {
        var answer = await context.AnswerOptions.FindAsync(answerId);
        if (answer == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "AnswerNotFound",
                Description = "Answer not found"
            });
        }

        if (answer.LessonQuizId != quizId)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "AnswerNotFound",
                Description = "Answer not found"
            });
        }

        try
        {
            context.AnswerOptions.Remove(answer);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "AnswerDeletionFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }
}