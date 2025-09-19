import { QueryClient } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import { moviesReducer } from '../store/slices/moviesSlice';
import { uiReducer } from '../store/slices/uiSlice';
import { filterReducer } from '../store/slices/filterSlice';
import { mockOMDbMovie, mockHeroMovie, mockOMDbSearchResponse } from './testData';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const createQueryClient = (options = {}) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        ...options,
      },
    },
  });
};

export const createTestStore = () => {
  return configureStore({
    reducer: {
      movies: moviesReducer,
      ui: uiReducer,
      filter: filterReducer,
    },
  });
};

// ============================================================================
// MOCK INSTANCES
// ============================================================================

export const mockOMDbServiceInstance = {
  getPopularMovies: vi.fn(),
  getTopRatedMovies: vi.fn(),
  getUpcomingMovies: vi.fn(),
  getMovieDetails: vi.fn(),
  searchMovies: vi.fn(),
};

export const mockApiServiceInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
  request: vi.fn(),
  updateBaseURL: vi.fn(),
  updateHeaders: vi.fn(),
  getConfig: vi.fn(),
};

// ============================================================================
// MOCK SETUP FUNCTIONS
// ============================================================================

export const setupApiServiceMocks = () => {
  vi.mock('../services/ApiService', () => ({
    ApiService: vi.fn().mockImplementation(() => mockApiServiceInstance),
  }));
};

export const setupAxiosMocks = () => {
  vi.mock('axios', () => ({
    create: vi.fn(() => mockApiServiceInstance),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    request: vi.fn(),
  }));
};

export const setupServiceMocks = () => {
  setupApiServiceMocks();
  setupAxiosMocks();
};

export const setupAllMocks = () => {
  setupServiceMocks();
};

export const setupCommonMocks = () => {
  // Mocks are now set at module level, no need to call setup functions
};

export const resetAllMocks = () => {
  vi.clearAllMocks();
  Object.values(mockOMDbServiceInstance).forEach(mock => mock.mockClear());
  Object.values(mockApiServiceInstance).forEach(mock => mock.mockClear());
};

// ============================================================================
// MOCK RESPONSE FUNCTIONS
// ============================================================================

export const mockSuccessfulApiResponse = () => {
  mockOMDbServiceInstance.getPopularMovies.mockResolvedValue({ results: [mockOMDbMovie] });
  mockOMDbServiceInstance.getTopRatedMovies.mockResolvedValue({ results: [mockOMDbMovie] });
  mockOMDbServiceInstance.getUpcomingMovies.mockResolvedValue({ results: [mockOMDbMovie] });
  mockOMDbServiceInstance.getMovieDetails.mockResolvedValue(mockHeroMovie);
  mockOMDbServiceInstance.searchMovies.mockResolvedValue(mockOMDbSearchResponse);
};

export const mockApiError = (errorMessage = 'Network Error') => {
  const error = new Error(errorMessage);
  mockOMDbServiceInstance.getPopularMovies.mockRejectedValue(error);
  mockOMDbServiceInstance.getTopRatedMovies.mockRejectedValue(error);
  mockOMDbServiceInstance.getUpcomingMovies.mockRejectedValue(error);
  mockOMDbServiceInstance.getMovieDetails.mockRejectedValue(error);
  mockOMDbServiceInstance.searchMovies.mockRejectedValue(error);
};

export const mockEmptyApiResponse = () => {
  mockOMDbServiceInstance.getPopularMovies.mockResolvedValue({ results: [] });
  mockOMDbServiceInstance.getTopRatedMovies.mockResolvedValue({ results: [] });
  mockOMDbServiceInstance.getUpcomingMovies.mockResolvedValue({ results: [] });
  mockOMDbServiceInstance.getMovieDetails.mockResolvedValue(null);
  mockOMDbServiceInstance.searchMovies.mockResolvedValue({ Search: [], totalResults: '0', Response: 'False' });
};
