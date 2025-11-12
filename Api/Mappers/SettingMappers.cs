using Api.DTOs.Setting;
using Library.Api.Models;

namespace Api.Mappers
{
    public static class SettingMappers
    {
        public static SettingDTO ToSettingDTO(this Setting setting)
        {
            return new SettingDTO
            {
                Id = setting.Id,
                Setting = setting.Setting1,
                Value = setting.Value
            };
        }

        public static Setting ToSettingFromUpdateDTO(this UpdateSettingDTO updateSettingDTO, int id, string settingName)
        {
            return new Setting
            {
                Id = id,
                Setting1 = settingName,
                Value = updateSettingDTO.Value
            };
        }
    }
}
