using System.ComponentModel.DataAnnotations.Schema;
using CodeClass.Domain.Tables.Lesson;
using CodeClass.Domain.User;

namespace CodeClass.Domain.Tables.Course;

public class CourseData
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
    [ForeignKey("UserId")]
    public string UserId { get; set; }
    
    public virtual UserData Teacher { get; set; }
    public virtual ICollection<LessonData> Lessons { get; set; }
}