using System.ComponentModel.DataAnnotations.Schema;
using CodeClass.Domain.Tables.Document;

namespace CodeClass.Domain.Tables.Lesson;

public class LessonResource
{
    public int Id { get; set; }
    [ForeignKey("LessonId")]
    public int LessonId { get; set; }
    public virtual LessonData Lesson { get; set; }
    [ForeignKey("DocumentId")]
    public int DocumentId { get; set; }
    
    public virtual DocumentData Document { get; set; }
}