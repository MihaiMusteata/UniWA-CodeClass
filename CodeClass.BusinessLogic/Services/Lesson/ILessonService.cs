using CodeClass.BusinessLogic.Models.Document;
using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Services.CrudService;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.Lesson;

public interface ILessonService : ICrudService<LessonDto>
{   
    Task<IEnumerable<DocumentDto>> GetAllLessonDocuments(int lessonId);
    Task<int> AttachDocumentToLesson(int lessonId, DocumentDto document);
    Task<float> GetFinalGrade(int lessonId, string userId);
}