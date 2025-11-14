/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

/**
 * Get the API base URL from environment variables
 * Removes trailing slashes for consistency
 */
export const getApiBaseUrl = (): string => {
  const baseUrl = process.env.REACT_APP_API_BASE || (window as any).__API_BASE__ || '';
  return baseUrl.replace(/\/+$/, '');
};

/**
 * API base URL constant
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/account/login',
  REGISTER: '/account/register',
  
  // Books
  BOOKS: '/books',
  BOOK_DETAIL: (id: number) => `/books/${id}`,
  
  // Loans
  LOANS: '/loans',
  LOAN_DETAIL: (id: number) => `/loans/${id}`,
  LOAN_BORROW: '/loans/borrow',
  LOAN_CHECKOUT: (id: number) => `/loans/${id}/checkout`,
  LOAN_RETURN: (id: number) => `/loans/${id}/return`,
  
  // Users
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_SEARCH: '/users/search',
  CURRENT_USER: '/users/current',
  ASSIGNABLE_ROLES: '/users/assignable-roles',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Settings
  SETTINGS: '/settings',
  SETTING_DETAIL: (id: number) => `/settings/${id}`,
} as const;
