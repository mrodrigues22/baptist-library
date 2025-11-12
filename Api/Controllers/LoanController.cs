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
    public class LoansController : ControllerBase
    {
        private readonly ILoanRepository _loanRepository;
        public LoansController(ILoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetLoans([FromQuery] QueryObject queryObject)
        {
            var loans = await _loanRepository.GetAllLoansAsync(queryObject);
            var loansDto = loans.Select(l => l.ToLoansDTO());
            return Ok(loansDto);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetLoanById(int id)
        {
            var loan = await _loanRepository.GetLoanByIdAsync(id);
            
            if (loan == null)
            {
                return NotFound();
            }

            return Ok(loan.ToLoanDTO());
        }

        [HttpPost]
        public async Task<IActionResult> CreateLoan([FromBody] CreateLoanDTO loanDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loan = await _loanRepository.CreateLoanAsync(loanDto.ToLoanFromCreateDTO(userId));
            return CreatedAtAction(nameof(GetLoanById), new { id = loan.Id }, loan.ToLoanDTO());
        }

        [HttpPost("createloanforself")]
        public async Task<IActionResult> CreateLoanForSelf([FromBody] CreateLoanForSelfDTO loanDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loan = await _loanRepository.CreateLoanAsync(loanDto.ToLoanFromCreateForSelfDTO(userId));
            return CreatedAtAction(nameof(GetLoanById), new { id = loan.Id }, loan.ToLoanDTO());
        }

        [HttpPatch("checkout/{id:int}")]
        public async Task<IActionResult> CheckOut(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loan = await _loanRepository.CheckOut(id, userId);
            
            if (loan == null)
            {
                return NotFound();
            }

            return Ok(loan.ToLoanDTO());
        }

        [HttpPatch("checkback/{id:int}")]
        public async Task<IActionResult> CheckBack(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var loan = await _loanRepository.CheckBack(id, userId);
            
            if (loan == null)
            {
                return NotFound();
            }

            return Ok(loan.ToLoanDTO());
        }
    

    }
}