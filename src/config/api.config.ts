/**
 * API Configuration
 * Handles environment variables and provides configuration for API services
 */
import { type OMDbConfig } from '../types/omdb.types';

export interface ApiConfig {
  readonly omdb: OMDbConfig;
}

/**
 * Get API configuration from environment variables
 * @returns ApiConfig object with all required configuration
 * @throws Error if required environment variables are missing
 */
export const getApiConfig = (): ApiConfig => {
  const omdbKey = import.meta.env.VITE_OMDB_API_KEY;
  const omdbBaseURL = import.meta.env.VITE_OMDB_BASE_URL;
  const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

  if (!omdbKey) {
    throw new Error('VITE_OMDB_API_KEY environment variable is required');
  }
  if (!omdbBaseURL) {
    throw new Error('VITE_OMDB_BASE_URL environment variable is required');
  }

  return {
    omdb: {
      apiKey: omdbKey,
      baseURL: omdbBaseURL,
      timeout,
    },
  };
};

/**
 * Check if API configuration is valid
 * @returns boolean indicating if all required environment variables are present
 */
export const isApiConfigValid = (): boolean => {
  try {
    getApiConfig();
    return true;
  } catch {
    return false;
  }
};