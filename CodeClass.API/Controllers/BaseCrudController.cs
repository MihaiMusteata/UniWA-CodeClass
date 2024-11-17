using CodeClass.BusinessLogic.Services.CrudService;
using Microsoft.AspNetCore.Mvc;

namespace CodeClass.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseCrudController<TEntityDto> : ControllerBase
{
    protected readonly ICrudService<TEntityDto> _service;

    protected BaseCrudController(ICrudService<TEntityDto> service)
    {
        _service = service;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var entities = await _service.GetAllAsync();
        return Ok(new {list = entities});
    }

    [HttpGet()]
    public async Task<IActionResult> Get(int id)
    {
        var entity = await _service.GetAsync(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create(TEntityDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return result.Succeeded ? Ok() : BadRequest(result.Errors);
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update(TEntityDto dto)
    {
        var result = await _service.UpdateAsync(dto);
        return result.Succeeded ? Ok() : BadRequest(result.Errors);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        return result.Succeeded ? Ok() : BadRequest(result.Errors);
    }
}