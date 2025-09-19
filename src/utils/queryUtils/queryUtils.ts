import { OMDbService } from '../../services/OMDbService';
import { getApiConfig } from '../../config/api.config';
import { type QueryError } from '../../types/query.types';

/**
 * Common query configuration constants
 */
export const QUERY_CONFIG = {
  STALE_TIME: {
    HOMEPAGE: 5 * 60 * 1000, // 5 minutes
    SEARCH: 2 * 60 * 1000, // 2 minutes
    MOVIE_DETAILS: 10 * 60 * 1000, // 10 minutes
    MOVIES: 5 * 60 * 1000, // 5 minutes
  },
  GC_TIME: {
    HOMEPAGE: 10 * 60 * 1000, // 10 minutes
    SEARCH: 5 * 60 * 1000, // 5 minutes
    MOVIE_DETAILS: 30 * 60 * 1000, // 30 minutes
    MOVIES: 10 * 60 * 1000, // 10 minutes
  },
  RATING_THRESHOLD: 7.0,
  MOVIES_PER_SECTION: 10,
} as const;

/**
 * Create and validate OMDb service instance
 * @returns OMDbService instance
 * @throws Error if API configuration is invalid
 */
export const createOMDbService = (): OMDbService => {
  const config = getApiConfig();
  if (!config.omdb.apiKey || !config.omdb.baseURL) {
    throw new Error('API configuration is invalid');
  }
  return new OMDbService({
    ...config.omdb,
    apiKey: config.omdb.apiKey,
    baseURL: config.omdb.baseURL,
  });
};

/**
 * Transform any error to QueryError format
 * @param error - Any error object
 * @returns QueryError object
 */
export const transformToQueryError = (error: unknown): QueryError => {
  const errorObj = error as { status?: number; code?: string };
  return {
    message: error instanceof Error ? error.message : 'Unknown error occurred',
    status: errorObj?.status,
    code: errorObj?.code,
  };
};

/**
 * Common query function wrapper that handles API service creation and error transformation
 * @param queryFn - The actual query function to execute
 * @returns Promise with the query result
 */
export const withQueryErrorHandling = async <T>(
  queryFn: (omdbService: OMDbService) => Promise<T>
): Promise<T> => {
  try {
    const omdbService = createOMDbService();
    return await queryFn(omdbService);
  } catch (error) {
    throw transformToQueryError(error);
  }
};

/**
 * Get current year as string
 */
export const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};

/**
 * Get next year as string
 */
export const getNextYear = (): string => {
  return (new Date().getFullYear() + 1).toString();
};
