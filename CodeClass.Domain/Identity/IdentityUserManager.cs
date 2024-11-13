using CodeClass.Domain.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CodeClass.Domain.Identity;

public class IdentityUserManager : UserManager<UserData>
{
    private CodeClassContext _databaseContext { get; set; }

    public IdentityUserManager(IUserStore<UserData> store, IOptions<IdentityOptions> optionsAccessor,
        IPasswordHasher<UserData> passwordHasher, IEnumerable<IUserValidator<UserData>> userValidators,
        IEnumerable<IPasswordValidator<UserData>> passwordValidators, ILookupNormalizer keyNormalizer,
        IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<UserData>> logger,
        CodeClassContext databaseContext)
        : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors,
            services, logger)
    {
        _databaseContext = databaseContext;
    }
    
    public override async Task<IdentityResult> CreateAsync(UserData user, string password)
    {
        var errors = new List<IdentityError>();
        var emailTaken = _databaseContext.Users.FirstOrDefault(u => u.Email == user.Email);
        if (emailTaken != null)
        {
            errors.Add(new IdentityError
            {
                Code = "EmailTaken",
                Description = "Email is already taken"
            });
        }
        else
        {
            var result = await base.CreateAsync(user, password);
            if (result.Succeeded)
            {
                return IdentityResult.Success;
            }

            foreach (var error in result.Errors)
            {
                errors.Add(error);
            }
        }

        return IdentityResult.Failed(errors.ToArray());
    }

}