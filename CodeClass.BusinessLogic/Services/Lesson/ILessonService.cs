using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Services.CrudService;

namespace CodeClass.BusinessLogic.Services.Lesson;

public interface ILessonService : ICrudService<LessonDto>
{
}