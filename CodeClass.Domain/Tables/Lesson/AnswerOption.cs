using System.ComponentModel.DataAnnotations.Schema;

namespace CodeClass.Domain.Tables.Lesson;

public class AnswerOption
{
    public int Id { get; set; }
    public string OptionText { get; set; }
    public bool IsCorrect { get; set; }
    [ForeignKey("LessonQuizId")]
    public int LessonQuizId { get; set; }
    
    public virtual LessonQuiz LessonQuiz { get; set; }
}