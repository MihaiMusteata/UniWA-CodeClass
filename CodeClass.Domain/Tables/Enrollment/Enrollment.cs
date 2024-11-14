using System.ComponentModel.DataAnnotations.Schema;
using CodeClass.Domain.Tables.Course;
using CodeClass.Domain.User;

namespace CodeClass.Domain.Tables.Enrollment;

public class Enrollment
{
    public int Id { get; set; }
    [ForeignKey("UserId")]
    public string UserId { get; set; }
    [ForeignKey("CourseId")]
    public int CourseId { get; set; }
    
    public virtual UserData Student { get; set; }
    public virtual CourseData Course { get; set; }
}
