using CodeClass.BusinessLogic.Models.Document;
using CodeClass.Domain.Tables.Document;

namespace CodeClass.BusinessLogic.Mapper.DocumentMapper;

public static class DocumentMapper
{
    public static DocumentDto ToDto(this DocumentData documentData)
    {
        return new DocumentDto
        {
            Id = documentData.Id,
            Name = documentData.Name,
            Extension = documentData.Extension
        };
    }
    
    public static DocumentData ToEntity(this DocumentDto documentDto)
    {
        return new DocumentData
        {
            Id = documentDto.Id,
            Name = documentDto.Name,
            Extension = documentDto.Extension
        };
    }
}