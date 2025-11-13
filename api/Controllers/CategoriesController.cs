using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Interfaces;
using Api.DTOs.Category;
using Api.Mappers;
using System.Security.Claims;

namespace Api.Controllers
{
    [Route("api/categories")]
    public class CategoriesController : BaseController
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCategories(CancellationToken cancellationToken)
        {
            var categories = await _categoryRepository.GetCategoriesAsync(cancellationToken);
            return Ok(categories.Select(c => c.ToCategoryDto()));
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategory(int id, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetCategoryAsync(id, cancellationToken);
            if (category == null) return NotFound();
            return Ok(category.ToCategoryDto());
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to create a category.");
            }

            // Check for duplicate
            if (await _categoryRepository.CategoryExistsAsync(dto.Description, null, cancellationToken))
            {
                return BadRequest("A category with this description already exists.");
            }

            var category = dto.ToCategoryFromCreateDto();
            var created = await _categoryRepository.CreateCategoryAsync(category, cancellationToken);
            return CreatedAtAction(nameof(GetCategory), new { id = created.Id }, created.ToCategoryDto());
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to update a category.");
            }

            // Check for duplicate (excluding current category)
            if (await _categoryRepository.CategoryExistsAsync(dto.Description, id, cancellationToken))
            {
                return BadRequest("A category with this description already exists.");
            }

            var updatedModel = new Library.Api.Models.Category { Description = dto.Description };
            var updated = await _categoryRepository.UpdateCategoryAsync(id, updatedModel, cancellationToken);
            if (updated == null) return NotFound($"Category with ID {id} not found.");
            return Ok(updated.ToCategoryDto());
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> DeleteCategory(int id, CancellationToken cancellationToken)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User must be authenticated to delete a category.");
            }

            var deleted = await _categoryRepository.DeleteCategoryAsync(id, cancellationToken);
            if (!deleted) return NotFound($"Category with ID {id} not found.");
            return NoContent();
        }
    }
}