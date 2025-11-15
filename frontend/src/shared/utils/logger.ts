/**
 * Centralized Logging Utility
 * Conditionally logs messages based on environment
 * Suppresses console output in production
 */

import { isProduction } from './env';

/**
 * Log informational message (development only)
 */
export const logInfo = (...args: any[]): void => {
  if (!isProduction()) {
    console.log(...args);
  }
};

/**
 * Log error message
 * In production, could send to error tracking service (e.g., Sentry)
 */
export const logError = (...args: any[]): void => {
  if (!isProduction()) {
    console.error(...args);
  } else {
    // In production, you might want to send errors to a monitoring service
    // Example: Sentry.captureException(args[0]);
  }
};

/**
 * Log warning message (development only)
 */
export const logWarning = (...args: any[]): void => {
  if (!isProduction()) {
    console.warn(...args);
  }
};

/**
 * Log debug message (development only)
 */
export const logDebug = (...args: any[]): void => {
  if (!isProduction()) {
    console.debug(...args);
  }
};
