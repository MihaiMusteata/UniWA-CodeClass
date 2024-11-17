namespace CodeClass.BusinessLogic.Models.Course;

public class CoursePreviewDto
{
    public int Id { get; set; }
    public string TeacherName { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public bool IsEnrolled { get; set; }
}