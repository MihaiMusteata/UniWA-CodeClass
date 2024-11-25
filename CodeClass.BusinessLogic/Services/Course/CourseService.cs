using CodeClass.BusinessLogic.Mapper.CourseMapper;
using CodeClass.BusinessLogic.Mapper.LessonMapper;
using CodeClass.BusinessLogic.Models.Course;
using CodeClass.BusinessLogic.Models.Lesson;
using CodeClass.BusinessLogic.Services.Lesson;
using CodeClass.Domain;
using CodeClass.Domain.Tables.Enrollment;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CodeClass.BusinessLogic.Services.Course;

public class CourseService(CodeClassDbContext context, ILessonService lessonService) : ICourseService
{
    private readonly CodeClassDbContext _context = context;
    private readonly ILessonService _lessonService = lessonService;

    public async Task<IEnumerable<CourseDto>> GetAllAsync()
    {
        var courses = await context.Courses.ToListAsync();
        return courses.Select(c => c.ToDto());
    }

    public async Task<CourseDto> GetAsync(int courseId)
    {
        var course = await context.Courses.FindAsync(courseId) ?? throw new Exception("Course not found");
        return course.ToDto();
    }

    public async Task<IdentityResult> CreateAsync(CourseDto course)
    {
        var newCourse = course.ToEntity();
        try
        {
            await context.Courses.AddAsync(newCourse);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseCreationFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> UpdateAsync(CourseDto course)
    {
        var oldCourse = await context.Courses.FindAsync(course.Id);
        if (oldCourse == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseNotFound",
                Description = "Course not found"
            });
        }

        oldCourse.Name = course.Name;
        oldCourse.Category = course.Category;

        try
        {
            context.Courses.Update(oldCourse);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseUpdateFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAsync(int courseId)
    {
        var course = await context.Courses.FindAsync(courseId);
        if (course == null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseNotFound",
                Description = "Course not found"
            });
        }

        try
        {
            context.Courses.Remove(course);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "CourseDeletionFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IEnumerable<CourseDto>> GetTeacherCoursesAsync(string teacherId)
    {
        var courses = await context.Courses
            .Where(c => c.UserId == teacherId)
            .Select(c => c.ToDto())
            .ToListAsync();

        courses.ForEach(c => c.TotalLessons = context.Lessons.Count(l => l.CourseId == c.Id));
        courses.ForEach(c => c.EnrolledStudents = context.Enrollments.Count(e => e.CourseId == c.Id));

        return courses;
    }

    public async Task<IEnumerable<LessonDto>> GetCourseLessonsAsync(int courseId)
    {
        var lessons = await context.Lessons
            .Where(l => l.CourseId == courseId)
            .Select(l => l.ToDto())
            .ToListAsync();

        return lessons;
    }

    public async Task<IdentityResult> EnrollStudentAsync(string studentId, int courseId)
    {
        var newEnrollment = new Enrollment
        {
            UserId = studentId,
            CourseId = courseId
        };
        try
        {
            await context.Enrollments.AddAsync(newEnrollment);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "EnrollmentFailed",
                Description = e.Message
            });
        }

        return IdentityResult.Success;
    }

    public async Task<IEnumerable<CoursePreviewDto>> GetStudentCoursesAsync(string studentId)
    {
        var enrolledCourses = await context.Enrollments
            .Include(e => e.Course)
            .ThenInclude(c => c.Teacher)
            .Where(e => e.UserId == studentId)
            .Select(e => e.Course.ToPreviewDto(true))
            .ToListAsync();

        var remainingCourses = await context.Courses
            .Include(c => c.Teacher)
            .Where(c => !enrolledCourses.Select(ec => ec.Id).Contains(c.Id))
            .Select(c => c.ToPreviewDto(false))
            .ToListAsync();

        return enrolledCourses.Concat(remainingCourses);
    }

    public async Task<CourseProgressData> GetCourseProgress(int courseId, string userId)
    {
        var lessons = await _context.Lessons
            .Include(l => l.LessonQuizzes).ThenInclude(lessonQuiz => lessonQuiz.AnswerOptions)
            .Where(l => l.CourseId == courseId)
            .ToListAsync();

        var lessonIds = lessons.Select(l => l.Id).ToList();

        var lessonFinalGrades = new Dictionary<int, float>();
        foreach (var lessonId in lessonIds)
        {
            var finalGrade = await _lessonService.GetFinalGrade(lessonId, userId);
            lessonFinalGrades.Add(lessonId, finalGrade);
        }

        var totalLessons = lessons.Count;
        var completedLessons = lessonFinalGrades.Count(grade => grade.Value != -1);
        var inProgressLessonIds = await _context.AnswersGiven
            .Include(answerGiven => answerGiven.LessonQuiz)
            .ThenInclude(lessonQuiz => lessonQuiz.Lesson)
            .Where(answerGiven => answerGiven.UserId == userId)
            .Where(answerGiven => lessonIds.Contains(answerGiven.LessonQuiz.LessonId))
            .Select(answerGiven => answerGiven.LessonQuiz.LessonId)
            .Distinct()
            .ToListAsync();

        var inProgressLessons = lessonFinalGrades
            .Where(grade => grade.Value == -1)
            .Select(grade => grade.Key)
            .Intersect(inProgressLessonIds)
            .Count();

        var totalQuestions = lessons
            .SelectMany(l => l.LessonQuizzes)
            .Count();

        var completedQuestions = await _context.AnswersGiven
            .Include(answerGiven => answerGiven.LessonQuiz)
            .Where(answerGiven => answerGiven.UserId == userId)
            .Where(answerGiven => lessonIds.Contains(answerGiven.LessonQuiz.LessonId))
            .Select(answerGiven => answerGiven.LessonQuizId)
            .Distinct()
            .CountAsync();

        var quizzes = await _context.LessonQuizzes
            .Include(lessonQuiz => lessonQuiz.AnswersGiven)
            .Where(lessonQuiz => lessonIds.Contains(lessonQuiz.LessonId))
            .ToListAsync();

        var questionsAnsweredCorrectly = await _context.AnswersGiven
            .Include(answerGiven => answerGiven.LessonQuiz)
            .ThenInclude(lessonQuiz => lessonQuiz.AnswerOptions)
            .Where(answerGiven => answerGiven.UserId == userId)
            .Where(answerGiven => lessonIds.Contains(answerGiven.LessonQuiz.LessonId))
            .GroupBy(answerGiven => answerGiven.LessonQuizId)
            .Where(group =>
                group.All(answerGiven =>
                    answerGiven.LessonQuiz.AnswerOptions.Any(option =>
                        option.Id == answerGiven.AnswerOptionId && option.IsCorrect))
                && group.Count() == group.First().LessonQuiz.AnswerOptions.Count(option => option.IsCorrect))
            .CountAsync();

        var questionsAnsweredWrong = await _context.AnswersGiven
            .Include(answerGiven => answerGiven.LessonQuiz)
            .ThenInclude(lessonQuiz => lessonQuiz.AnswerOptions)
            .Where(answerGiven => answerGiven.UserId == userId)
            .Where(answerGiven => lessonIds.Contains(answerGiven.LessonQuiz.LessonId))
            .GroupBy(answerGiven => answerGiven.LessonQuizId)
            .Where(group =>
                group.All(answerGiven =>
                    answerGiven.LessonQuiz.AnswerOptions.Any(option =>
                        option.Id == answerGiven.AnswerOptionId && !option.IsCorrect)))
            .CountAsync();

        var questionsAnsweredPartiallyCorrectly =
            completedQuestions - questionsAnsweredCorrectly - questionsAnsweredWrong;

        var lessonProgress = new Dictionary<int, LessonProgressData>();
        foreach (var lesson in lessons)
        {
            var lessonQuizzes = lesson.LessonQuizzes;
            var lessonId = lesson.Id;

            var lessonQuestions = lessonQuizzes.Count;
            var lessonCompletedQuestions = await _context.AnswersGiven
                .Where(answerGiven => answerGiven.LessonQuiz.LessonId == lessonId && answerGiven.UserId == userId)
                .Select(answerGiven => answerGiven.LessonQuizId)
                .Distinct()
                .CountAsync();

            var lessonQuestionsAnsweredCorrectly = await _context.AnswersGiven
                .Include(answerGiven => answerGiven.LessonQuiz)
                .ThenInclude(lessonQuiz => lessonQuiz.AnswerOptions)
                .Where(answerGiven => answerGiven.UserId == userId && answerGiven.LessonQuiz.LessonId == lessonId)
                .GroupBy(answerGiven => answerGiven.LessonQuizId)
                .Where(group =>
                    group.All(answerGiven =>
                        answerGiven.LessonQuiz.AnswerOptions.Any(option =>
                            option.Id == answerGiven.AnswerOptionId && option.IsCorrect))
                    && group.Count() == group.First().LessonQuiz.AnswerOptions.Count(option => option.IsCorrect))
                .CountAsync();

            var lessonQuestionsAnsweredWrong = await _context.AnswersGiven
                .Include(answerGiven => answerGiven.LessonQuiz)
                .ThenInclude(lessonQuiz => lessonQuiz.AnswerOptions)
                .Where(answerGiven => answerGiven.UserId == userId && answerGiven.LessonQuiz.LessonId == lessonId)
                .GroupBy(answerGiven => answerGiven.LessonQuizId)
                .Where(group =>
                    group.All(answerGiven =>
                        answerGiven.LessonQuiz.AnswerOptions.Any(option =>
                            option.Id == answerGiven.AnswerOptionId && !option.IsCorrect)))
                .CountAsync();

            var lessonQuestionsAnsweredPartiallyCorrectly =
                lessonCompletedQuestions - lessonQuestionsAnsweredCorrectly - lessonQuestionsAnsweredWrong;

            lessonProgress.Add(lessonId, new LessonProgressData
            {
                TotalQuestions = lessonQuestions,
                CompletedQuestions = lessonCompletedQuestions,
                QuestionsAnsweredCorrectly = lessonQuestionsAnsweredCorrectly,
                QuestionsAnsweredPartiallyCorrectly = lessonQuestionsAnsweredPartiallyCorrectly,
                QuestionsAnsweredWrong = lessonQuestionsAnsweredWrong
            });
        }


        return new CourseProgressData
        {
            TotalLessons = totalLessons,
            CompletedLessons = completedLessons,
            InProgressLessons = inProgressLessons,
            TotalQuestions = totalQuestions,
            CompletedQuestions = completedQuestions,
            QuestionsAnsweredCorrectly = questionsAnsweredCorrectly,
            QuestionsAnsweredPartiallyCorrectly = questionsAnsweredPartiallyCorrectly,
            QuestionsAnsweredWrong = questionsAnsweredWrong,
            TotalProgress = (int)Math.Round((completedLessons + completedQuestions) /
                (float)(totalLessons + totalQuestions) * 100),
            LessonProgress = lessonProgress
        };
    }
}