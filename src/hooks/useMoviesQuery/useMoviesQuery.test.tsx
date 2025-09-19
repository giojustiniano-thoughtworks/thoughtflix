import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMoviesQuery } from './useMoviesQuery';
import { 
  setupCommonMocks,
  createQueryClient,
  mockSuccessfulApiResponse,
  resetAllMocks,
  mockOMDbServiceInstance
} from '../../__mocks__/testUtils';
import { QueryWrapper } from '../../__mocks__/testMocks';
import { mockMovie } from '../../__mocks__/testData';

// Mock OMDbService
vi.mock('../../services/OMDbService', () => ({
  OMDbService: vi.fn().mockImplementation(() => mockOMDbServiceInstance),
}));

// Mock the api.config module to avoid import.meta issues
vi.mock('../../config/api.config', () => ({
  getApiConfig: vi.fn(() => ({
    omdb: {
      apiKey: 'test-key',
      baseURL: 'https://test.com',
      timeout: 10000,
    },
  })),
  isApiConfigValid: vi.fn(() => true),
}));

// Mock data transformers
vi.mock('../../utils/dataTransformers', () => ({
  createHomePageData: vi.fn((heroMovie, sections) => ({
    heroMovie: heroMovie || null,
    sections,
  })),
  transformMoviesToSections: vi.fn((popular, topRated, upcoming) => {
    const sections = [];
    if (popular.length > 0) sections.push({ title: 'Big Hits', movies: popular, type: 'big_hits' });
    if (topRated.length > 0) sections.push({ title: 'Top Rated', movies: topRated, type: 'top_rated' });
    if (upcoming.length > 0) sections.push({ title: 'Recently Released', movies: upcoming, type: 'recently_released' });
    return sections;
  }),
  transformOMDbSearchResultToMovie: vi.fn(() => mockMovie),
  transformOMDbMovieToMovie: vi.fn(() => mockMovie),
}));

// Setup common mocks
setupCommonMocks();

// Test wrapper component
const createTestWrapper = () => {
  const queryClient = createQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryWrapper queryClient={queryClient}>
      {children}
    </QueryWrapper>
  );
};

describe('useMoviesQuery', () => {
  beforeEach(() => {
    resetAllMocks();
    mockSuccessfulApiResponse();
  });

  describe('useHomePageQuery', () => {
    it('GIVEN successful data fetch WHEN using useHomePageQuery THEN should return correct data', async () => {
      // GIVEN
      // Mocks are set in beforeEach

      // WHEN
      const { result } = renderHook(() => useMoviesQuery.useHomePageQuery(), {
        wrapper: createTestWrapper(),
      });

      // THEN
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('GIVEN API error WHEN using useHomePageQuery THEN should return error state', async () => {
      // GIVEN
      const errorMessage = 'Network Error';
      mockOMDbServiceInstance.getPopularMovies.mockRejectedValue(new Error(errorMessage));

      // WHEN
      const { result } = renderHook(() => useMoviesQuery.useHomePageQuery(), {
        wrapper: createTestWrapper(),
      });

      // THEN
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe(errorMessage);
    });
  });

  describe('useMovieSearchQuery', () => {
    it('GIVEN successful search WHEN using useMovieSearchQuery THEN should return correct data', async () => {
      // GIVEN
      const query = 'test';
      const page = 1;

      // WHEN
      const { result } = renderHook(() => useMoviesQuery.useMovieSearchQuery({ query, page }), {
        wrapper: createTestWrapper(),
      });

      // THEN
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.isError).toBe(false);
    });

    it('GIVEN search error WHEN using useMovieSearchQuery THEN should return error state', async () => {
      // GIVEN
      const errorMessage = 'Search Error';
      mockOMDbServiceInstance.searchMovies.mockRejectedValue(new Error(errorMessage));

      // WHEN
      const { result } = renderHook(() => useMoviesQuery.useMovieSearchQuery({ query: 'test', page: 1 }), {
        wrapper: createTestWrapper(),
      });

      // THEN
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe(errorMessage);
    });
  });

  describe('useMovieDetailsQuery', () => {
    it('GIVEN successful movie details fetch WHEN using useMovieDetailsQuery THEN should return correct data', async () => {
      // GIVEN
      const movieId = 'tt1234567';

      // WHEN
      const { result } = renderHook(() => useMoviesQuery.useMovieDetailsQuery(movieId), {
        wrapper: createTestWrapper(),
      });

      // THEN
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.isError).toBe(false);
    });

    it('GIVEN movie not found WHEN using useMovieDetailsQuery THEN should return null data', async () => {
      // GIVEN
      const movieId = 'tt9999999';
      mockOMDbServiceInstance.getMovieDetails.mockResolvedValue(null);

      // WHEN
      const { result } = renderHook(() => useMoviesQuery.useMovieDetailsQuery(movieId), {
        wrapper: createTestWrapper(),
      });

      // THEN
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Query Options', () => {
    it('GIVEN enabled option WHEN using useMovieSearchQuery with empty query THEN should not execute query', async () => {
      // GIVEN
      const query = '';
      const page = 1;

      // WHEN
      const { result } = renderHook(() => useMoviesQuery.useMovieSearchQuery({ query, page }), {
        wrapper: createTestWrapper(),
      });

      // THEN
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockOMDbServiceInstance.searchMovies).not.toHaveBeenCalled();
    });

    it('GIVEN staleTime option WHEN using useHomePageQuery THEN should cache data appropriately', async () => {
      // GIVEN
      const queryClient = createQueryClient({
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryWrapper queryClient={queryClient}>
          {children}
        </QueryWrapper>
      );

      // WHEN
      const { result, rerender } = renderHook(() => useMoviesQuery.useHomePageQuery(), {
        wrapper,
      });

      // THEN
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Rerender to test caching
      rerender();

      // Should still be successful and not refetch
      expect(result.current.isLoading).toBe(false);
    });
  });
});