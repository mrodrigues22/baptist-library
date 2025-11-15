/**
 * Input Sanitization Utilities
 * Provides functions to sanitize user inputs and prevent XSS attacks
 */

/**
 * Sanitize a string by removing potentially dangerous HTML and script tags
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim();
};

/**
 * Sanitize HTML string by escaping special characters
 * @param html - The HTML string to escape
 * @returns Escaped HTML string safe for display
 */
export const escapeHtml = (html: string): string => {
  if (!html) return '';
  
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }
  
  return url.trim();
};

/**
 * Sanitize error message for display to users
 * Removes sensitive technical details in production
 * @param error - The error object or message
 * @param fallbackMessage - Fallback message to show in production
 * @returns User-friendly error message
 */
export const sanitizeErrorMessage = (
  error: any,
  fallbackMessage: string = 'Ocorreu um erro. Por favor, tente novamente.'
): string => {
  // In development, show detailed errors
  if (process.env.NODE_ENV === 'development') {
    return error?.message || error?.toString() || fallbackMessage;
  }
  
  // In production, return generic message unless it's a user-friendly message
  const message = error?.message || '';
  
  // Allow specific user-friendly error patterns
  const userFriendlyPatterns = [
    /não encontrado/i,
    /não autorizado/i,
    /sem permissão/i,
    /credenciais inválidas/i,
    /sessão expirada/i,
    /not found/i,
    /unauthorized/i,
    /forbidden/i,
  ];
  
  const isUserFriendly = userFriendlyPatterns.some(pattern => pattern.test(message));
  
  return isUserFriendly ? message : fallbackMessage;
};

/**
 * Validate and sanitize search query
 * @param query - Search query string
 * @returns Sanitized search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query) return '';
  
  return query
    .trim()
    .replace(/[<>'"]/g, '') // Remove quotes and brackets
    .slice(0, 200); // Limit length
};
