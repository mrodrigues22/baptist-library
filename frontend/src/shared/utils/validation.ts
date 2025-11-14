/**
 * Formats a phone number to Brazilian format: (11) 91234-5678 or (11) 1234-5678
 * @param value - The input value to format
 * @returns Formatted phone number string
 */
export const formatBrazilianPhone = (value: string): string => {
  // Remove all non-digits
  const numbers = value.replace(/\D/g, '');
  
  // Limit to 11 digits (DDD + 9 digits)
  const limited = numbers.slice(0, 11);
  
  // Apply mask
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
};

/**
 * Validates a Brazilian phone number
 * @param phone - The phone number to validate (can be formatted or unformatted)
 * @returns True if valid, false otherwise
 */
export const validateBrazilianPhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const numbers = phone.replace(/\D/g, '');
  // Valid formats: 10 digits (DDD + 8 digits) or 11 digits (DDD + 9 digits with 9 at start)
  return numbers.length === 10 || numbers.length === 11;
};

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns True if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
