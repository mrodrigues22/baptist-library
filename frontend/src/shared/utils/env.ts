/**
 * Environment Configuration Validation
 * Ensures required environment variables are set before app initialization
 */

interface EnvironmentConfig {
  apiBaseUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

/**
 * Validates and returns environment configuration
 * @throws Error if required environment variables are missing
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE;

  if (!apiBaseUrl) {
    throw new Error(
      'REACT_APP_API_BASE environment variable is not set. ' +
      'Please configure it in your .env file.'
    );
  }

  // Validate URL format
  try {
    new URL(apiBaseUrl);
  } catch (error) {
    throw new Error(
      `REACT_APP_API_BASE is not a valid URL: ${apiBaseUrl}`
    );
  }

  return {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ''), // Remove trailing slashes
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  };
};

/**
 * Get validated API base URL
 */
export const getApiBaseUrl = (): string => {
  return getEnvironmentConfig().apiBaseUrl;
};

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};
