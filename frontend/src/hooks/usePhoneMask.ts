import { useState, ChangeEvent } from 'react';

/**
 * Custom hook for Brazilian phone number masking
 * Formats: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 */
export const usePhoneMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const formatPhoneNumber = (input: string): string => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');
    
    // Limit to 11 digits (Brazilian format)
    const limited = numbers.slice(0, 11);
    
    // Apply mask based on length
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    } else {
      // 11 digits: (XX) XXXXX-XXXX
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue(formatted);
  };

  const getRawValue = (): string => {
    return value.replace(/\D/g, '');
  };

  return {
    value,
    onChange: handleChange,
    getRawValue,
    setValue: (newValue: string) => setValue(formatPhoneNumber(newValue))
  };
};
