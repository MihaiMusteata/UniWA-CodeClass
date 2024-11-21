namespace CodeClass.BusinessLogic.Models.LessonQuiz;

public class GivenAnswerDto
{
    public int LessonQuizId { get; set; }
    public IEnumerable<int> GivenAnswerIds { get; set; }
    public string UserId { get; set; }
}