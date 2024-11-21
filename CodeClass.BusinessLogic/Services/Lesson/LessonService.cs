using CodeClass.BusinessLogic.Mapper.DocumentMapper;
using CodeClass.BusinessLogic.Mapper.LessonMapper;
using CodeClass.BusinessLogic.Models.Document;
using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.Domain;
using CodeClass.Domain.Tables.Lesson;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CodeClass.BusinessLogic.Services.Lesson;

public class LessonService(CodeClassDbContext context, IConfiguration configuration, IWebHostEnvironment env)
    : ILessonService
{
    private readonly IConfiguration _configuration = configuration;
    private readonly IWebHostEnvironment _env = env;
    private readonly CodeClassDbContext _context = context;

    public async Task<IEnumerable<LessonDto>> GetAllAsync()
    {
        var lessons = await _context.Lessons.ToListAsync();
        return lessons.Select(l => l.ToDto());
    }

    public async Task<LessonDto> GetAsync(int lessonId)
    {
        var lesson = await _context.Lessons.FindAsync(lessonId) ?? throw new Exception("Lesson not found");
        return lesson.ToDto();
    }

    public async Task<IdentityResult> CreateAsync(LessonDto lesson)
    {
        var newLesson = lesson.ToEntity();
        try
        {
            await _context.Lessons.AddAsync(newLesson);
            await _context.SaveChangesAsync();
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
        var oldLesson = await _context.Lessons.FindAsync(lesson.Id);
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
            _context.Lessons.Update(oldLesson);
            await _context.SaveChangesAsync();
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
        var lesson = await _context.Lessons.FindAsync(lessonId);
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
            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();
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

    public async Task<IEnumerable<DocumentDto>> GetAllLessonDocuments(int lessonId)
    {
        var documents = await _context.LessonResources
            .Include(lr => lr.Document)
            .Where(lr => lr.LessonId == lessonId)
            .ToListAsync();

        return documents.Select(d => d.Document.ToDto());
    }

    public async Task<int> AttachDocumentToLesson(int lessonId, DocumentDto document)
    {
        try
        {
            var addedDocument = await _context.Documents.AddAsync(document.ToEntity());
            await _context.SaveChangesAsync();

            var documentId = addedDocument.Entity.Id;

            await _context.LessonResources.AddAsync(new LessonResource
            {
                LessonId = lessonId,
                DocumentId = documentId
            });
            await _context.SaveChangesAsync();
            document.FolderPath = Path.Combine(_env.ContentRootPath, "Uploads", documentId.ToString());
            Directory.CreateDirectory(document.FolderPath);
            await using var fs =
                new FileStream(Path.Combine(document.FolderPath, $"{document.Name}{document.Extension}"),
                    FileMode.Create);
            await fs.WriteAsync(document.Content);
            return documentId;
        }
        catch (Exception e)
        {
            throw new Exception("An error occurred while attaching the document to the lesson", e);
        }
    }

    public async Task<float> GetFinalGrade(int lessonId, string userId)
    {
        // Obține toate chestionarele asociate lecției
        var lessonQuizzes = await _context.LessonQuizzes
            .Include(q => q.AnswerOptions)
            .Where(q => q.LessonId == lessonId)
            .ToListAsync();

        // Obține toate răspunsurile date de utilizator pentru lecție
        var userAnswers = await _context.AnswersGiven
            .Include(a => a.AnswerOption)
            .Where(a => a.UserId == userId && a.AnswerOption.LessonQuiz.LessonId == lessonId)
            .ToListAsync();

        // Variabile pentru punctaj total și numărul de întrebări
        float totalPoints = 0;
        int totalQuestions = lessonQuizzes.Count;
        int totalQuestionsAnswered = userAnswers.Select(ans => ans.AnswerOption.LessonQuizId).Distinct().Count();

        foreach (var quiz in lessonQuizzes)
        {
            // Obține răspunsurile corecte pentru întrebare
            var correctAnswers = quiz.AnswerOptions.Where(opt => opt.IsCorrect).ToList();
            int correctAnswerCount = correctAnswers.Count;

            // Obține răspunsurile selectate de utilizator pentru întrebare
            var selectedAnswers = userAnswers
                .Where(ans => ans.AnswerOption.LessonQuizId == quiz.Id)
                .Select(ans => ans.AnswerOption)
                .ToList();

            int selectedCorrect = selectedAnswers.Count(opt => opt.IsCorrect);
            int selectedIncorrect = selectedAnswers.Count(opt => !opt.IsCorrect);

            // Calcul punctaj pentru această întrebare
            float questionPoints = 0;

            if (selectedIncorrect == 0)
            {
                // Dacă nu există răspunsuri greșite
                questionPoints = (float)selectedCorrect / correctAnswerCount;
            }
            else
            {
                // Dacă există răspunsuri greșite, scad punctele corespunzătoare
                questionPoints = Math.Max(0,
                    (float)selectedCorrect / correctAnswerCount - (float)selectedIncorrect / correctAnswerCount);
            }

            totalPoints += questionPoints;
        }

        // Calculul notei finale
        float maxPoints = totalQuestions; // Fiecare întrebare valorează 1 punct
        float finalGrade = (totalPoints / maxPoints) * 10; // Nota pe o scală de 10
        
        if (totalQuestions == totalQuestionsAnswered)
        {
            return finalGrade;
        }

        return -1;
    }
}