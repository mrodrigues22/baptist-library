using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.DTOs.Loan;
using Api.Helpers;
using Api.Helpers.Loan;
using Api.Interfaces;
using Library.Api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{
    [Route("api/loans")]
    [ApiController]
    [Authorize]
    public class LoansController : ControllerBase
    {
        private readonly ILoanRepository _loanRepository;
        public LoansController(ILoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetLoans([FromQuery] QueryObject queryObject, CancellationToken cancellationToken)
        {
            var result = await _loanRepository.GetPagedLoansAsync(queryObject, cancellationToken);
            var items = result.Items.Select(l => l.ToLoanSummaryDto());
            return Ok(new {
                items,
                totalCount = result.TotalCount,
                pageNumber = result.PageNumber,
                pageSize = result.PageSize
            });
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetLoanById(int id, CancellationToken cancellationToken)
        {
            var loan = await _loanRepository.GetLoanAsync(id, cancellationToken);
            
            if (loan == null)
            {
                return NotFound();
            }

            return Ok(loan.ToLoanDetailDto());
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateLoan([FromBody] CreateLoanDto loanDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loan = await _loanRepository.CreateLoanAsync(loanDto.ToLoanFromCreateDto(userId), cancellationToken);
            return CreatedAtAction(nameof(GetLoanById), new { id = loan.Id }, loan.ToLoanDetailDto());
        }

        [HttpPost("borrow")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário,Membro")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> BorrowBook([FromBody] BorrowBookDto borrowDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loan = await _loanRepository.CreateLoanAsync(borrowDto.ToLoanFromBorrowDto(userId), cancellationToken);
            return CreatedAtAction(nameof(GetLoanById), new { id = loan.Id }, loan.ToLoanDetailDto());
        }

        [HttpPatch("checkout/{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CheckOut(int id, CancellationToken cancellationToken)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loan = await _loanRepository.CheckOut(id, userId, cancellationToken);
            
            if (loan == null)
            {
                return NotFound();
            }

            return Ok(loan.ToLoanDetailDto());
        }

        [HttpPatch("return/{id:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ReturnBook(int id, CancellationToken cancellationToken)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loan = await _loanRepository.ReturnBook(id, userId, cancellationToken);
            
            if (loan == null)
            {
                return NotFound();
            }

            return Ok(loan.ToLoanDetailDto());
        }

        [HttpPost("request/{bookId:int}")]
        [Authorize(Roles = "Administrador,Desenvolvedor,Bibliotecário,Membro")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RequestLoan(int bookId, CancellationToken cancellationToken)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _loanRepository.BorrowBookWithValidationAsync(bookId, userId, cancellationToken);

            if (!result.Success)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            return CreatedAtAction(nameof(GetLoanById), new { id = result.Loan!.Id }, result.Loan.ToLoanDetailDto());
        }
    }
}