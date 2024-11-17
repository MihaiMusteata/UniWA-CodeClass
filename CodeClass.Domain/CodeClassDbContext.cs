using CodeClass.Domain.Tables.Answer;
using CodeClass.Domain.Tables.Course;
using CodeClass.Domain.Tables.Document;
using CodeClass.Domain.Tables.Enrollment;
using CodeClass.Domain.Tables.Lesson;
using CodeClass.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CodeClass.Domain;

public class CodeClassDbContext : IdentityDbContext<UserData>
{
    public CodeClassDbContext()
    {
    }

    public CodeClassDbContext(DbContextOptions<CodeClassDbContext> options) : base(options)
    {
    }

    public DbSet<UserData> Users { get; set; }
    public DbSet<CourseData> Courses { get; set; }
    public DbSet<DocumentData> Documents { get; set; }
    public DbSet<LessonData> Lessons { get; set; }
    public DbSet<LessonQuiz> LessonQuizzes { get; set; }
    public DbSet<LessonResource> LessonResources { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<AnswerOption> AnswerOptions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CourseData>()
            .HasOne(c => c.Teacher)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LessonData>()
            .HasOne(l => l.Course)
            .WithMany(c => c.Lessons)
            .HasForeignKey(l => l.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LessonQuiz>()
            .HasOne(q => q.Lesson)
            .WithMany(l => l.LessonQuizzes)
            .HasForeignKey(q => q.LessonId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LessonResource>()
            .HasOne(lr => lr.Lesson)
            .WithMany()
            .HasForeignKey(lr => lr.LessonId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LessonResource>()
            .HasOne(lr => lr.Document)
            .WithMany()
            .HasForeignKey(lr => lr.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Student)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Course)
            .WithMany()
            .HasForeignKey(e => e.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AnswerOption>()
            .HasOne(a => a.LessonQuiz)
            .WithMany(q => q.AnswerOptions)
            .HasForeignKey(a => a.LessonQuizId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}