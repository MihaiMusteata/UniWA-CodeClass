using CodeClass.BusinessLogic.Models.Document;
using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Services.Lesson;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[Route("api/lesson")]
[ApiController]
public class LessonController: BaseCrudController<LessonDto>
{
    private readonly ILessonService _lessonService;
    public LessonController(ILessonService lessonService) : base(lessonService)
    {
        _lessonService = lessonService;
    }

    [HttpGet("{lessonId}/documents")]
    public async Task<IEnumerable<DocumentDto>> GetLessonDocumentsAsync(int lessonId)
    {
        var documents = await _lessonService.GetAllLessonDocuments(lessonId);
        return documents;
    }
    
    [HttpPost("{lessonId}/document")]
    public async Task<IActionResult> AttachDocumentToLessonAsync(int lessonId, IFormFile file)
    {
        var document = new DocumentDto();
        using (var ms = new MemoryStream())
        {
            await file.CopyToAsync(ms);
            document.Content = ms.ToArray();
            document.Extension = Path.GetExtension(file.FileName);
            document.Name = Path.GetFileNameWithoutExtension(file.FileName);
        }
        var documentId = await _lessonService.AttachDocumentToLesson(lessonId, document);
        return Ok(documentId);
    }
    
    [HttpGet("{lessonId}/my-grade")]
    public async Task<float> GetFinalGradeAsync(int lessonId, string userId)
    {
        return await _lessonService.GetFinalGrade(lessonId, userId);
    }
}