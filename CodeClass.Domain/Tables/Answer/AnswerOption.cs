using System.ComponentModel.DataAnnotations.Schema;
using CodeClass.Domain.Tables.Lesson;

namespace CodeClass.Domain.Tables.Answer;

public class AnswerOption
{
    public int Id { get; set; }
    public string OptionText { get; set; }
    public bool IsCorrect { get; set; }
    [ForeignKey("LessonQuizId")]
    public int LessonQuizId { get; set; }
    
    public virtual LessonQuiz LessonQuiz { get; set; }
}