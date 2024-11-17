using System.IdentityModel.Tokens.Jwt;
using System.Text;
using CodeClass.BusinessLogic.Services.Authentication;
using CodeClass.BusinessLogic.Services.Course;
using CodeClass.BusinessLogic.Services.Lesson;
using CodeClass.BusinessLogic.Services.LessonQuiz;
using CodeClass.Domain;
using CodeClass.Domain.Identity;
using CodeClass.Domain.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Builder services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddLogging();

builder.Services.AddDbContext<CodeClassDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<UserData, IdentityRole>()
    .AddEntityFrameworkStores<CodeClassDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddScoped<IdentityUserManager>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ILessonService, LessonService>();
builder.Services.AddScoped<ILessonQuizService, LessonQuizService>();

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = long.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 3L * 1024 * 1024 * 1024;
    serverOptions.Limits.MaxRequestBufferSize = 3L * 1024 * 1024 * 1024;
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateActor = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        RequireExpirationTime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration.GetValue<string>("Jwt:Issuer"),
        ValidAudience = builder.Configuration.GetValue<string>("Jwt:Audience"),
        IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("Jwt:Key")))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["jwt"];

            if (!string.IsNullOrEmpty(token))
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                if (jwtToken.ValidTo > DateTime.UtcNow)
                {
                    context.Token = token;
                }
                else
                {
                    context.Fail("Token has expired");
                }
            }

            return Task.CompletedTask;
        }
    };
});

builder.Services.AddCors(options =>
{
    var frontendUrl = builder.Configuration.GetValue<string>("FrontendURL");

    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(frontendUrl, "http://localhost:3031")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

// app.UseAuthentication();
// app.UseAuthorization();

app.MapControllers();
app.Run();