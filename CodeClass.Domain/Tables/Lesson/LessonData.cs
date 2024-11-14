using System.ComponentModel.DataAnnotations.Schema;
using CodeClass.Domain.Tables.Course;
using CodeClass.Domain.Tables.Document;

namespace CodeClass.Domain.Tables.Lesson;

public class LessonData
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    [ForeignKey("CourseId")]
    public int CourseId { get; set; }
    
    public virtual CourseData Course { get; set; }
    public virtual ICollection<LessonQuiz> LessonQuizzes { get; set; }
    public virtual ICollection<LessonResource> Documents { get; set; }
}