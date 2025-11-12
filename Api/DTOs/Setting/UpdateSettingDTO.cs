using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Setting;

public class UpdateSettingDTO
{
    [Required]
    [Display(Name = "Valor")]
    public int Value { get; set; }
}
