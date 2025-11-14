using System.ComponentModel.DataAnnotations;

namespace Api.Attributes
{
    /// <summary>
    /// Validates that a list has at least a minimum number of elements
    /// </summary>
    public class MinListLengthAttribute : ValidationAttribute
    {
        private readonly int _minLength;

        public MinListLengthAttribute(int minLength)
        {
            _minLength = minLength;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return ValidationResult.Success; // Let [Required] handle null
            }

            if (value is not System.Collections.IList list)
            {
                return new ValidationResult("Value must be a list");
            }

            if (list.Count < _minLength)
            {
                return new ValidationResult(
                    ErrorMessage ?? $"The list must contain at least {_minLength} item(s)"
                );
            }

            return ValidationResult.Success;
        }
    }
}
