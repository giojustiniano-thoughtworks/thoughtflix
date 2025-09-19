import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach, type MockedFunction, type MockedClass } from 'vitest';
import moviesReducer, {
  setHeroMovie,
  setSections,
  setSearchResults,
  setSearchQuery,
  setLoading,
  setError,
  clearErrors,
  setPagination,
  resetMoviesState,
  fetchHomePageData,
  searchMovies,
} from './moviesSlice';
import { type Movie, type HeroMovie, type MovieSection } from '../../../types/movie.types';
import { OMDbService } from '../../../services/OMDbService';
import { getApiConfig } from '../../../config/api.config';
import { createHomePageData, transformMoviesToSections } from '../../../utils/dataTransformers';

// Mock the OMDbService
vi.mock('../../../services/OMDbService', () => ({
  OMDbService: vi.fn().mockImplementation(() => ({
    getPopularMovies: vi.fn(),
    getTopRatedMovies: vi.fn(),
    getUpcomingMovies: vi.fn(),
    getMovieDetails: vi.fn(),
    searchMovies: vi.fn(),
  })),
}));

// Mock the data transformers
vi.mock('../../../utils/dataTransformers', () => ({
  transformMoviesToSections: vi.fn(),
  createHomePageData: vi.fn(),
}));

// Mock the API config
vi.mock('../../../config/api.config', () => ({
  getApiConfig: vi.fn(),
}));

describe('Movies Slice', () => {
  let store: ReturnType<typeof configureStore<{ movies: ReturnType<typeof moviesReducer> }>>;

  const mockHeroMovie: HeroMovie = {
    id: 'tt1234567',
    title: 'Test Hero Movie',
    overview: 'Test hero overview',
    poster_path: '/hero.jpg',
    backdrop_path: '/hero_backdrop.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [],
    adult: false,
    original_language: 'en',
    original_title: 'Test Hero Movie',
    popularity: 0,
    video: false,
    tagline: 'Test hero tagline',
  };

  const mockMovie: Movie = {
    id: 'tt1234568',
    title: 'Test Movie',
    overview: 'Test overview',
    poster_path: '/movie.jpg',
    backdrop_path: '/movie_backdrop.jpg',
    release_date: '2023-01-02',
    vote_average: 7.5,
    vote_count: 500,
    genre_ids: [],
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie',
    popularity: 0,
    video: false,
  };

  const mockSection: MovieSection = {
    title: 'Big Hits',
    movies: [mockMovie],
    type: 'big_hits',
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        movies: moviesReducer,
      },
    });
  });

  describe('Initial State', () => {
    it('GIVEN initial state WHEN movies slice is created THEN should have correct default values', () => {
      // GIVEN
      const initialState = store.getState().movies;

      // WHEN & THEN
      expect(initialState.heroMovie).toBeNull();
      expect(initialState.sections).toEqual([]);
      expect(initialState.searchResults).toEqual([]);
      expect(initialState.searchQuery).toBe('');
      expect(initialState.isLoadingHero).toBe(false);
      expect(initialState.isLoadingSections).toBe(false);
      expect(initialState.isLoadingSearch).toBe(false);
      expect(initialState.heroError).toBeNull();
      expect(initialState.sectionsError).toBeNull();
      expect(initialState.searchError).toBeNull();
      expect(initialState.currentPage).toBe(1);
      expect(initialState.totalPages).toBe(0);
    });
  });

  describe('Synchronous Actions', () => {
    const actionTestCases = [
      {
        description: 'setHeroMovie action',
        action: () => setHeroMovie(mockHeroMovie),
        expectedState: {
          heroMovie: mockHeroMovie,
          heroError: null,
        },
      },
      {
        description: 'setHeroMovie with null',
        action: () => setHeroMovie(null),
        expectedState: {
          heroMovie: null,
        },
        setup: () => store.dispatch(setHeroMovie(mockHeroMovie)),
      },
      {
        description: 'setSections action',
        action: () => setSections([mockSection]),
        expectedState: {
          sections: [mockSection],
          sectionsError: null,
        },
      },
      {
        description: 'setSearchResults action',
        action: () => setSearchResults([mockMovie]),
        expectedState: {
          searchResults: [mockMovie],
          searchError: null,
        },
      },
      {
        description: 'setSearchQuery action',
        action: () => setSearchQuery('test search'),
        expectedState: {
          searchQuery: 'test search',
        },
      },
      {
        description: 'setLoading action',
        action: () => setLoading({
          hero: true,
          sections: true,
          search: true,
        }),
        expectedState: {
          isLoadingHero: true,
          isLoadingSections: true,
          isLoadingSearch: true,
        },
      },
      {
        description: 'setError action',
        action: () => setError({
          hero: 'Hero error',
          sections: 'Sections error',
          search: 'Search error',
        }),
        expectedState: {
          heroError: 'Hero error',
          sectionsError: 'Sections error',
          searchError: 'Search error',
        },
      },
      {
        description: 'setPagination action',
        action: () => setPagination({
          currentPage: 2,
          totalPages: 10,
        }),
        expectedState: {
          currentPage: 2,
          totalPages: 10,
        },
      },
    ];

    actionTestCases.forEach(({ description, action, expectedState, setup }) => {
      it(`GIVEN ${description} WHEN dispatched THEN should update state correctly`, () => {
        // GIVEN
        if (setup) setup();

        // WHEN
        store.dispatch(action());

        // THEN
        const newState = store.getState().movies;
        Object.entries(expectedState).forEach(([key, value]) => {
          expect(newState[key as keyof typeof newState]).toEqual(value);
        });
      });
    });

    it('GIVEN clearErrors action WHEN dispatched THEN should clear all errors', () => {
      // GIVEN
      store.dispatch(setError({
        hero: 'Hero error',
        sections: 'Sections error',
        search: 'Search error',
      }));

      // WHEN
      store.dispatch(clearErrors());

      // THEN
      const newState = store.getState().movies;
      expect(newState.heroError).toBeNull();
      expect(newState.sectionsError).toBeNull();
      expect(newState.searchError).toBeNull();
    });

    it('GIVEN resetMoviesState action WHEN dispatched THEN should reset to initial state', () => {
      // GIVEN
      store.dispatch(setHeroMovie(mockHeroMovie));
      store.dispatch(setSections([mockSection]));
      store.dispatch(setSearchResults([mockMovie]));
      store.dispatch(setSearchQuery('test'));

      // WHEN
      store.dispatch(resetMoviesState());

      // THEN
      const newState = store.getState().movies;
      expect(newState.heroMovie).toBeNull();
      expect(newState.sections).toEqual([]);
      expect(newState.searchResults).toEqual([]);
      expect(newState.searchQuery).toBe('');
    });
  });

  describe('Async Thunks', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('GIVEN fetchHomePageData thunk WHEN dispatched successfully THEN should update state with data', async () => {
      // GIVEN
      const mockOMDbService = {
        getPopularMovies: vi.fn().mockResolvedValue({ results: [mockMovie] }),
        getTopRatedMovies: vi.fn().mockResolvedValue({ results: [mockMovie] }),
        getUpcomingMovies: vi.fn().mockResolvedValue({ results: [mockMovie] }),
        getMovieDetails: vi.fn().mockResolvedValue(mockHeroMovie),
      };

      (OMDbService as MockedClass<typeof OMDbService>).mockImplementation(() => mockOMDbService as unknown as OMDbService);

      (getApiConfig as MockedFunction<typeof getApiConfig>).mockReturnValue({
        omdb: {
          apiKey: 'test-key',
          baseURL: 'https://test.com',
          timeout: 10000,
        },
      });

      (transformMoviesToSections as MockedFunction<typeof transformMoviesToSections>).mockReturnValue([mockSection]);
      (createHomePageData as MockedFunction<typeof createHomePageData>).mockReturnValue({
        heroMovie: mockHeroMovie,
        sections: [mockSection],
      });

      // WHEN
      await store.dispatch(fetchHomePageData({}));

      // THEN
      const state = store.getState().movies;
      expect(state.heroMovie).toEqual(mockHeroMovie);
      expect(state.sections).toEqual([mockSection]);
      expect(state.isLoadingHero).toBe(false);
      expect(state.isLoadingSections).toBe(false);
      expect(state.heroError).toBeNull();
      expect(state.sectionsError).toBeNull();
    });

    it('GIVEN fetchHomePageData thunk WHEN dispatched with error THEN should update state with error', async () => {
      // GIVEN
      const mockOMDbService = {
        getPopularMovies: vi.fn().mockRejectedValue(new Error('API Error')),
        getTopRatedMovies: vi.fn().mockResolvedValue({ results: [] }),
        getUpcomingMovies: vi.fn().mockResolvedValue({ results: [] }),
        getMovieDetails: vi.fn().mockResolvedValue(null),
      };

      (OMDbService as MockedClass<typeof OMDbService>).mockImplementation(() => mockOMDbService as unknown as OMDbService);

      (getApiConfig as MockedFunction<typeof getApiConfig>).mockReturnValue({
        omdb: {
          apiKey: 'test-key',
          baseURL: 'https://test.com',
          timeout: 10000,
        },
      });

      // WHEN
      await store.dispatch(fetchHomePageData({}));

      // THEN
      const state = store.getState().movies;
      expect(state.heroMovie).toBeNull();
      expect(state.sections).toEqual([]);
      expect(state.isLoadingHero).toBe(false);
      expect(state.isLoadingSections).toBe(false);
      expect(state.sectionsError).toBe('API Error');
    });

    it('GIVEN searchMovies thunk WHEN dispatched successfully THEN should update search results', async () => {
      // GIVEN
      const mockOMDbService = {
        searchMovies: vi.fn().mockResolvedValue({
          Search: [{
            Title: 'Test Movie',
            Year: '2023',
            imdbID: 'tt1234567',
            Type: 'movie',
            Poster: '/poster.jpg',
          }],
          totalResults: '1',
          Response: 'True',
        }),
      };

      (OMDbService as MockedClass<typeof OMDbService>).mockImplementation(() => mockOMDbService as unknown as OMDbService);

      (getApiConfig as MockedFunction<typeof getApiConfig>).mockReturnValue({
        omdb: {
          apiKey: 'test-key',
          baseURL: 'https://test.com',
          timeout: 10000,
        },
      });

      // WHEN
      await store.dispatch(searchMovies({ query: 'test', page: 1 }));

      // THEN
      const state = store.getState().movies;
      expect(state.searchResults).toHaveLength(1);
      expect(state.searchQuery).toBe('test');
      expect(state.isLoadingSearch).toBe(false);
      expect(state.searchError).toBeNull();
    });

    it('GIVEN searchMovies thunk WHEN dispatched with error THEN should update state with error', async () => {
      // GIVEN
      const mockOMDbService = {
        searchMovies: vi.fn().mockRejectedValue(new Error('Search Error')),
      };

      (OMDbService as MockedClass<typeof OMDbService>).mockImplementation(() => mockOMDbService as unknown as OMDbService);

      (getApiConfig as MockedFunction<typeof getApiConfig>).mockReturnValue({
        omdb: {
          apiKey: 'test-key',
          baseURL: 'https://test.com',
          timeout: 10000,
        },
      });

      // WHEN
      await store.dispatch(searchMovies({ query: 'test', page: 1 }));

      // THEN
      const state = store.getState().movies;
      expect(state.searchResults).toEqual([]);
      expect(state.searchQuery).toBe(''); // searchQuery is not set in rejected case
      expect(state.isLoadingSearch).toBe(false);
      expect(state.searchError).toBe('Search Error');
    });
  });
});
