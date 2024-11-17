namespace CodeClass.BusinessLogic.Models.Document;

public class DocumentDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Extension { get; set; }
    public byte[] Content { get; set; }
    public string FolderPath { get; set; }
}