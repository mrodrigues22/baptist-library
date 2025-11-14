using Microsoft.AspNetCore.Mvc;
using Api.Interfaces;
using Api.DTOs.Setting;
using Api.Mappers;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [Route("api/settings")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingRepository _settingRepository;

        public SettingsController(ISettingRepository settingRepository)
        {
            _settingRepository = settingRepository;
        }

        // GET: api/settings
        [HttpGet]
        [Authorize(Roles = "Administrador,Desenvolvedor")]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _settingRepository.GetAllSettingsAsync();
            var settingsDto = settings.Select(s => s.ToSettingDTO());
            return Ok(settingsDto);
        }

        // GET: api/settings/{id}
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor")]
        public async Task<IActionResult> GetSetting(int id)
        {
            var setting = await _settingRepository.GetSettingByIdAsync(id);

            if (setting == null)
            {
                return NotFound($"Setting with ID {id} not found.");
            }

            var settingDto = setting.ToSettingDTO();
            return Ok(settingDto);
        }

        // PUT: api/settings/{id}
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor")]
        public async Task<IActionResult> UpdateSetting(int id, [FromBody] UpdateSettingDTO settingDto)
        {
            var updatedSetting = await _settingRepository.UpdateSettingAsync(id, settingDto.Value);

            if (updatedSetting == null)
            {
                return NotFound($"Setting with ID {id} not found.");
            }

            return Ok(new { id = updatedSetting.Id, message = "Setting updated successfully" });
        }
    }
}
