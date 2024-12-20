using System.ComponentModel.DataAnnotations.Schema;
using CodeClass.Domain.Tables.Answer;

namespace CodeClass.Domain.Tables.Lesson;

public class LessonQuiz
{
    public int Id { get; set; }
    public string Question { get; set; }
    [ForeignKey("LessonId")]
    public int LessonId { get; set; }
    
    public virtual LessonData Lesson { get; set; }
    public virtual ICollection<AnswerOption> AnswerOptions { get; set; }
    public virtual ICollection<AnswerGiven> AnswersGiven { get; set; }
}