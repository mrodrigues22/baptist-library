using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Interfaces;
using Api.DTOs.Category;
using Api.Mappers;

namespace Api.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryRepository.GetActiveCategoriesAsync();
            return Ok(categories.Select(c => c.ToCategoryDTO()));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);
            if (category == null) return NotFound();
            return Ok(category.ToCategoryDTO());
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var category = new Library.Api.Models.Category { Description = dto.Description, IsActive = true };
            var created = await _categoryRepository.CreateCategoryAsync(category);
            return CreatedAtAction(nameof(GetCategory), new { id = created.Id }, created.ToCategoryDTO());
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedModel = new Library.Api.Models.Category { Description = dto.Description };
            var updated = await _categoryRepository.UpdateCategoryAsync(id, updatedModel);
            if (updated == null) return NotFound();
            return Ok(updated.ToCategoryDTO());
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var deleted = await _categoryRepository.DeleteCategoryAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}