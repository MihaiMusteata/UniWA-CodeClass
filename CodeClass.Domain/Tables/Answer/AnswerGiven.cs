using System.ComponentModel.DataAnnotations.Schema;
using CodeClass.Domain.Tables.Lesson;
using CodeClass.Domain.User;

namespace CodeClass.Domain.Tables.Answer;

public class AnswerGiven
{
    public int Id { get; set; }
    [ForeignKey("LessonQuizId")]
    public int LessonQuizId { get; set; }
    [ForeignKey("AnswerOptionId")]
    public int AnswerOptionId { get; set; }
    [ForeignKey("UserId")]
    public string UserId { get; set; }
    
    public virtual AnswerOption AnswerOption { get; set; }
    public virtual LessonQuiz LessonQuiz { get; set; }
    public virtual UserData User { get; set; }
}