using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace CodeClass.BusinessLogic.Services.CrudService;

public interface ICrudService<TEntityDto>
{
    Task<IEnumerable<TEntityDto>> GetAllAsync();
    Task<TEntityDto> GetAsync(int id);
    Task<IdentityResult> CreateAsync(TEntityDto dto);
    Task<IdentityResult> UpdateAsync(TEntityDto dto);
    Task<IdentityResult> DeleteAsync(int id);
}