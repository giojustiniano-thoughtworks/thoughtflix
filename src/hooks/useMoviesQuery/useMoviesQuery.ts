import { useQuery } from '@tanstack/react-query';
import { createHomePageData, transformMoviesToSections, transformOMDbSearchResultToMovie } from '../../utils/dataTransformers';
import { queryKeys } from '../../lib/queryClient';
import { withQueryErrorHandling, QUERY_CONFIG } from '../../utils/queryUtils';
import { 
  type HomePageQueryResult, 
  type MoviesQueryResult, 
  type MovieSearchQueryResult, 
  type MovieDetailsQueryResult,
  type MovieQueryParams,
  type MovieSearchParams,
  type QueryError
} from '../../types/query.types';

/**
 * Custom hook for movie-related queries using React Query
 */
export const useMoviesQuery = {
  /**
   * Hook for fetching homepage data (hero movie + sections)
   */
  useHomePageQuery: (params?: MovieQueryParams): HomePageQueryResult => {
    const queryResult = useQuery({
      queryKey: queryKeys.homePage.data(),
      queryFn: () => withQueryErrorHandling(async (omdbService) => {
        // Fetch all data in parallel
        const [popularResponse, topRatedResponse, upcomingResponse] = await Promise.all([
          omdbService.getPopularMovies({ page: params?.page || 1, year: params?.year }),
          omdbService.getTopRatedMovies({ page: params?.page || 1, year: params?.year }),
          omdbService.getUpcomingMovies({ page: params?.page || 1 }),
        ]);

        // Get hero movie from the first popular movie
        const heroMovie = popularResponse.results.length > 0 
          ? await omdbService.getMovieDetails(String(popularResponse.results[0].id))
          : null;

        // Transform movies to sections
        const sections = transformMoviesToSections(
          popularResponse.results,
          topRatedResponse.results,
          upcomingResponse.results
        );

        return createHomePageData(heroMovie || undefined, sections);
      }),
      staleTime: QUERY_CONFIG.STALE_TIME.HOMEPAGE,
      gcTime: QUERY_CONFIG.GC_TIME.HOMEPAGE,
    });

    return {
      data: queryResult.data,
      isLoading: queryResult.isLoading,
      isError: queryResult.isError,
      error: queryResult.error as QueryError | null,
      refetch: queryResult.refetch,
    };
  },

  /**
   * Hook for searching movies
   */
  useMovieSearchQuery: (params: MovieSearchParams): MovieSearchQueryResult => {
    const queryResult = useQuery({
      queryKey: queryKeys.movies.search(params.query, params.page),
      queryFn: () => withQueryErrorHandling(async (omdbService) => {
        // Don't execute query if query is empty
        if (!params.query.trim()) {
          return {
            results: [],
            totalResults: 0,
            hasMore: false,
          };
        }

        const response = await omdbService.searchMovies({
          s: params.query,
          page: params.page || 1,
          type: params.type,
          y: params.year,
        });

        // Transform OMDb search results to Movie objects using centralized transformer
        const movies = response.Search ? response.Search.map(transformOMDbSearchResultToMovie) : [];

        return {
          results: movies,
          totalResults: parseInt(response.totalResults) || 0,
          hasMore: (params.page || 1) * 10 < (parseInt(response.totalResults) || 0),
        };
      }),
      enabled: !!params.query.trim(), // Only execute if query is not empty
      staleTime: QUERY_CONFIG.STALE_TIME.SEARCH,
      gcTime: QUERY_CONFIG.GC_TIME.SEARCH,
    });

    return {
      data: queryResult.data,
      isLoading: queryResult.isLoading,
      isError: queryResult.isError,
      error: queryResult.error as QueryError | null,
      refetch: queryResult.refetch,
    };
  },

  /**
   * Hook for fetching movie details
   */
  useMovieDetailsQuery: (movieId: string): MovieDetailsQueryResult => {
    const queryResult = useQuery({
      queryKey: queryKeys.movies.details(movieId),
      queryFn: () => withQueryErrorHandling(async (omdbService) => {
        if (!movieId) {
          return null;
        }

        const movieDetails = await omdbService.getMovieDetails(movieId);
        return movieDetails;
      }),
      enabled: !!movieId, // Only execute if movieId is provided
      staleTime: QUERY_CONFIG.STALE_TIME.MOVIE_DETAILS,
      gcTime: QUERY_CONFIG.GC_TIME.MOVIE_DETAILS,
    });

    return {
      data: queryResult.data,
      isLoading: queryResult.isLoading,
      isError: queryResult.isError,
      error: queryResult.error as QueryError | null,
      refetch: queryResult.refetch,
    };
  },

  /**
   * Hook for fetching popular movies
   */
  usePopularMoviesQuery: (params?: MovieQueryParams): MoviesQueryResult => {
    const queryResult = useQuery({
      queryKey: queryKeys.movies.popular(),
      queryFn: () => withQueryErrorHandling(async (omdbService) => {
        const response = await omdbService.getPopularMovies({ page: params?.page || 1, year: params?.year });
        return response.results;
      }),
      staleTime: QUERY_CONFIG.STALE_TIME.MOVIES,
      gcTime: QUERY_CONFIG.GC_TIME.MOVIES,
    });

    return {
      data: queryResult.data,
      isLoading: queryResult.isLoading,
      isError: queryResult.isError,
      error: queryResult.error as QueryError | null,
      refetch: queryResult.refetch,
    };
  },

  /**
   * Hook for fetching top rated movies
   */
  useTopRatedMoviesQuery: (params?: MovieQueryParams): MoviesQueryResult => {
    const queryResult = useQuery({
      queryKey: queryKeys.movies.topRated(),
      queryFn: () => withQueryErrorHandling(async (omdbService) => {
        const response = await omdbService.getTopRatedMovies({ page: params?.page || 1, year: params?.year });
        return response.results;
      }),
      staleTime: QUERY_CONFIG.STALE_TIME.MOVIES,
      gcTime: QUERY_CONFIG.GC_TIME.MOVIES,
    });

    return {
      data: queryResult.data,
      isLoading: queryResult.isLoading,
      isError: queryResult.isError,
      error: queryResult.error as QueryError | null,
      refetch: queryResult.refetch,
    };
  },

  /**
   * Hook for fetching upcoming movies
   */
  useUpcomingMoviesQuery: (params?: MovieQueryParams): MoviesQueryResult => {
    const queryResult = useQuery({
      queryKey: queryKeys.movies.upcoming(),
      queryFn: () => withQueryErrorHandling(async (omdbService) => {
        const response = await omdbService.getUpcomingMovies({ page: params?.page || 1 });
        return response.results;
      }),
      staleTime: QUERY_CONFIG.STALE_TIME.MOVIES,
      gcTime: QUERY_CONFIG.GC_TIME.MOVIES,
    });

    return {
      data: queryResult.data,
      isLoading: queryResult.isLoading,
      isError: queryResult.isError,
      error: queryResult.error as QueryError | null,
      refetch: queryResult.refetch,
    };
  },
};
