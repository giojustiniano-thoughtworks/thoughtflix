import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Movie, type HeroMovie, type MovieSection } from '../../../types/movie.types';
import { type MovieState, type MovieSearchParams, type MovieFetchParams } from '../../../types/redux.types';
import { OMDbService } from '../../../services/OMDbService';
import { getApiConfig } from '../../../config/api.config';
import { transformMoviesToSections, createHomePageData } from '../../../utils/dataTransformers';

/**
 * Initial state for movies slice
 */
const initialState: MovieState = {
  heroMovie: null,
  sections: [],
  searchResults: [],
  searchQuery: '',
  isLoadingHero: false,
  isLoadingSections: false,
  isLoadingSearch: false,
  heroError: null,
  sectionsError: null,
  searchError: null,
  currentPage: 1,
  totalPages: 0,
};

/**
 * Async thunk to fetch homepage data
 */
export const fetchHomePageData = createAsyncThunk(
  'movies/fetchHomePageData',
  async (params: MovieFetchParams = {}, { rejectWithValue }) => {
    try {
      const config = getApiConfig();
      const omdbService = new OMDbService({
        apiKey: config.omdb.apiKey || '',
        baseURL: config.omdb.baseURL || '',
        timeout: config.omdb.timeout,
      });

      // Fetch all movie data in parallel
      const [popularResponse, topRatedResponse, upcomingResponse] = await Promise.all([
        omdbService.getPopularMovies({ page: params.page || 1, year: params.year }),
        omdbService.getTopRatedMovies({ page: params.page || 1, year: params.year }),
        omdbService.getUpcomingMovies({ page: params.page || 1 }),
      ]);

      // Get the first popular movie as hero movie
      const heroMovieId = popularResponse.results[0]?.id;
      let heroMovie = null;

      if (heroMovieId) {
        try {
          heroMovie = await omdbService.getMovieDetails(String(heroMovieId));
        } catch {
          // Continue without hero movie if details fetch fails
        }
      }

      // Transform movies to sections
      const sections = transformMoviesToSections(
        popularResponse.results,
        topRatedResponse.results,
        upcomingResponse.results
      );

      // Create home page data
      const homePageData = createHomePageData(heroMovie || undefined, sections);

      return homePageData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to search movies
 */
export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async (params: MovieSearchParams, { rejectWithValue }) => {
    try {
      const config = getApiConfig();
      const omdbService = new OMDbService({
        apiKey: config.omdb.apiKey || '',
        baseURL: config.omdb.baseURL || '',
        timeout: config.omdb.timeout,
      });

      const searchResponse = await omdbService.searchMovies({
        s: params.query,
        page: params.page || 1,
        y: params.year,
      });

      if (searchResponse.Response === 'False' || !searchResponse.Search) {
        return {
          results: [],
          totalResults: 0,
          query: params.query,
        };
      }

      // Transform search results to Movie objects
      const movies = searchResponse.Search.map((searchResult) => ({
        id: searchResult.imdbID,
        title: searchResult.Title,
        overview: 'No overview available.',
        poster_path: searchResult.Poster !== 'N/A' ? searchResult.Poster : '/placeholder-movie.jpg',
        backdrop_path: searchResult.Poster !== 'N/A' ? searchResult.Poster : '/placeholder-movie.jpg',
        release_date: searchResult.Year ? `${searchResult.Year}-01-01` : 'N/A',
        vote_average: 0,
        vote_count: 0,
        genre_ids: [],
        adult: false,
        original_language: 'en',
        original_title: searchResult.Title,
        popularity: 0,
        video: false,
      }));

      return {
        results: movies,
        totalResults: parseInt(searchResponse.totalResults) || 0,
        query: params.query,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Movies slice
 */
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    /**
     * Set hero movie
     */
    setHeroMovie: (state, action: PayloadAction<HeroMovie | null>) => {
      state.heroMovie = action.payload;
      state.heroError = null;
    },

    /**
     * Set movie sections
     */
    setSections: (state, action: PayloadAction<MovieSection[]>) => {
      state.sections = action.payload;
      state.sectionsError = null;
    },

    /**
     * Set search results
     */
    setSearchResults: (state, action: PayloadAction<Movie[]>) => {
      state.searchResults = action.payload;
      state.searchError = null;
    },

    /**
     * Set search query
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    /**
     * Set loading states
     */
    setLoading: (state, action: PayloadAction<{ hero?: boolean; sections?: boolean; search?: boolean }>) => {
      if (action.payload.hero !== undefined) {
        state.isLoadingHero = action.payload.hero;
      }
      if (action.payload.sections !== undefined) {
        state.isLoadingSections = action.payload.sections;
      }
      if (action.payload.search !== undefined) {
        state.isLoadingSearch = action.payload.search;
      }
    },

    /**
     * Set error states
     */
    setError: (state, action: PayloadAction<{ hero?: string; sections?: string; search?: string }>) => {
      if (action.payload.hero !== undefined) {
        state.heroError = action.payload.hero;
      }
      if (action.payload.sections !== undefined) {
        state.sectionsError = action.payload.sections;
      }
      if (action.payload.search !== undefined) {
        state.searchError = action.payload.search;
      }
    },

    /**
     * Clear all errors
     */
    clearErrors: (state) => {
      state.heroError = null;
      state.sectionsError = null;
      state.searchError = null;
    },

    /**
     * Set pagination
     */
    setPagination: (state, action: PayloadAction<{ currentPage: number; totalPages: number }>) => {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },

    /**
     * Reset movies state to initial state
     */
    resetMoviesState: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Fetch homepage data
    builder
      .addCase(fetchHomePageData.pending, (state) => {
        state.isLoadingHero = true;
        state.isLoadingSections = true;
        state.heroError = null;
        state.sectionsError = null;
      })
      .addCase(fetchHomePageData.fulfilled, (state, action) => {
        state.isLoadingHero = false;
        state.isLoadingSections = false;
        state.heroMovie = action.payload.heroMovie;
        state.sections = action.payload.sections;
        state.heroError = null;
        state.sectionsError = null;
      })
      .addCase(fetchHomePageData.rejected, (state, action) => {
        state.isLoadingHero = false;
        state.isLoadingSections = false;
        state.heroError = action.payload as string;
        state.sectionsError = action.payload as string;
      });

    // Search movies
    builder
      .addCase(searchMovies.pending, (state) => {
        state.isLoadingSearch = true;
        state.searchError = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.isLoadingSearch = false;
        state.searchResults = action.payload.results;
        state.searchQuery = action.payload.query;
        state.totalPages = Math.ceil(action.payload.totalResults / 10); // Assuming 10 results per page
        state.searchError = null;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.isLoadingSearch = false;
        state.searchError = action.payload as string;
        // Note: searchQuery is not set in rejected case as it's not available in the action
      });
  },
});

export const {
  setHeroMovie,
  setSections,
  setSearchResults,
  setSearchQuery,
  setLoading,
  setError,
  clearErrors,
  setPagination,
  resetMoviesState,
} = moviesSlice.actions;

export default moviesSlice.reducer;