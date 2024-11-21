namespace CodeClass.BusinessLogic.Models.LessonQuiz;

public class QuizAnswerDto
{
    public int Id { get; set; }
    public string OptionText { get; set; }
    public bool IsCorrect { get; set; }
}