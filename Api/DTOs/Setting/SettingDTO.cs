using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Setting;

public class SettingDTO
{
    public int Id { get; set; }

    [Display(Name = "Configuração")]
    public string Setting { get; set; }

    [Display(Name = "Valor")]
    public int Value { get; set; }
}
