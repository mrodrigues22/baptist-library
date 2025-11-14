/**
 * API utility functions for authenticated requests
 * Centralized HTTP client with error handling, token management, and response normalization
 */

import { API_BASE_URL } from './api/config';
import { toast } from 'react-toastify';

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Get the JWT token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set the JWT token in localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Clear the JWT token from localStorage
 */
export const clearToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Get the authorization header with the JWT token
 */
export const getAuthHeader = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

/**
 * Handle HTTP errors and trigger logout on 401
 */
const handleHttpError = async (response: Response): Promise<never> => {
  let errorMessage = `HTTP error! status: ${response.status}`;
  let errorDetails: any = null;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorDetails = await response.json();
      errorMessage = errorDetails.message || errorDetails.error || errorMessage;
    } else {
      errorMessage = await response.text() || errorMessage;
    }
  } catch {
    // Use default error message if parsing fails
  }

  // Handle 401 - Unauthorized (token expired or invalid)
  if (response.status === 401) {
    clearToken();
    // Trigger auth context logout via custom event
    window.dispatchEvent(new Event('unauthorized'));
    toast.error('Sessão expirada. Por favor, faça login novamente.');
  }

  // Handle 403 - Forbidden
  if (response.status === 403) {
    toast.error('Você não tem permissão para realizar esta ação.');
  }

  const error: ApiError = {
    status: response.status,
    message: errorMessage,
    details: errorDetails,
  };

  throw error;
};

// ============================================================================
// RESPONSE NORMALIZATION
// ============================================================================

/**
 * Normalize object keys from PascalCase to camelCase
 */
export const normalizeToCamelCase = <T = any>(obj: any): T => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(normalizeToCamelCase) as any;

  const normalized: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      normalized[camelKey] = normalizeToCamelCase(obj[key]);
    }
  }
  return normalized;
};

// ============================================================================
// HTTP METHODS
// ============================================================================

/**
 * Make an authenticated GET request
 */
export const authenticatedGet = async <T = any>(endpoint: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    signal,
  });
  
  if (!response.ok) {
    return handleHttpError(response);
  }
  
  return response.json();
};

/**
 * Make an authenticated POST request
 */
export const authenticatedPost = async <T = any>(endpoint: string, data: any, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
    signal,
  });
  
  if (!response.ok) {
    return handleHttpError(response);
  }
  
  return response.json();
};

/**
 * Make an authenticated PUT request
 */
export const authenticatedPut = async <T = any>(endpoint: string, data: any, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
    signal,
  });
  
  if (!response.ok) {
    return handleHttpError(response);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }
  
  return response.json();
};

/**
 * Make an authenticated PATCH request
 */
export const authenticatedPatch = async <T = any>(endpoint: string, data: any, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
    signal,
  });
  
  if (!response.ok) {
    return handleHttpError(response);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }
  
  return response.json();
};

/**
 * Make an authenticated DELETE request
 */
export const authenticatedDelete = async <T = any>(endpoint: string, signal?: AbortSignal): Promise<T | null> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    signal,
  });
  
  if (!response.ok) {
    return handleHttpError(response);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// ============================================================================
// UNAUTHENTICATED REQUESTS (for public endpoints)
// ============================================================================

/**
 * Make an unauthenticated GET request
 */
export const publicGet = async <T = any>(endpoint: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });
  
  if (!response.ok) {
    return handleHttpError(response);
  }
  
  return response.json();
};

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

/**
 * Login user with email and password
 */
export const loginUser = async (email: string, password: string, signal?: AbortSignal) => {
  const response = await fetch(`${API_BASE_URL}/account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    signal,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Register a new user
 */
export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}, signal?: AbortSignal) => {
  const response = await fetch(`${API_BASE_URL}/account/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    signal,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
