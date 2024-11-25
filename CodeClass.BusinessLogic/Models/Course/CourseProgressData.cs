namespace CodeClass.BusinessLogic.Models.Course;

public class CourseProgressData
{
    public int TotalProgress { get; set; }

    public int TotalLessons { get; set; }
    public int CompletedLessons { get; set; }
    public int InProgressLessons { get; set; }

    public Dictionary<int, LessonProgressData> LessonProgress { get; set; }
    
    public int TotalQuestions { get; set; }
    public int CompletedQuestions { get; set; }
    
    public int QuestionsAnsweredCorrectly { get; set; }
    public int QuestionsAnsweredPartiallyCorrectly { get; set; }
    public int QuestionsAnsweredWrong { get; set; }
}


public class LessonProgressData
{
    public int TotalQuestions { get; set; }
    public int CompletedQuestions { get; set; }
    public int QuestionsAnsweredCorrectly { get; set; }
    public int QuestionsAnsweredPartiallyCorrectly { get; set; }
    public int QuestionsAnsweredWrong { get; set; }
}