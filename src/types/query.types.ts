import { type Movie, type HeroMovie, type MovieSection } from './movie.types';
import { type BaseError } from './api.types';

/**
 * React Query specific types
 */
export type QueryError = BaseError;

/**
 * Query result wrapper for consistent error handling
 */
export interface QueryResult<T> {
  readonly data: T | undefined | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: QueryError | null;
  readonly refetch: () => Promise<unknown>;
}

/**
 * Home page data query result
 */
export type HomePageQueryResult = QueryResult<{
  heroMovie: HeroMovie | null;
  sections: MovieSection[];
}>;

/**
 * Movies query result
 */
export type MoviesQueryResult = QueryResult<Movie[]>;

/**
 * Movie search query result
 */
export type MovieSearchQueryResult = QueryResult<{
  results: Movie[];
  totalResults: number;
  hasMore: boolean;
}>;

/**
 * Movie details query result
 */
export type MovieDetailsQueryResult = QueryResult<HeroMovie>;

/**
 * Base query parameters interface
 */
export interface BaseQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Query parameters for movie fetching
 */
export interface MovieQueryParams extends BaseQueryParams {
  readonly year?: string;
  readonly type?: 'movie' | 'series' | 'episode';
  readonly genre?: string;
  readonly rating?: number;
}

/**
 * Query parameters for movie search
 */
export interface MovieSearchParams extends MovieQueryParams {
  readonly query: string;
  readonly includeAdult?: boolean;
  readonly language?: string;
  readonly region?: string;
}

/**
 * Query parameters for movie details
 */
export interface MovieDetailsParams {
  readonly id: string | number;
  readonly includeCredits?: boolean;
  readonly includeVideos?: boolean;
  readonly includeImages?: boolean;
  readonly appendToResponse?: string[];
}

/**
 * Query options interface
 */
export interface QueryOptions<T> {
  readonly enabled?: boolean;
  readonly staleTime?: number;
  readonly cacheTime?: number;
  readonly refetchOnWindowFocus?: boolean;
  readonly refetchOnMount?: boolean;
  readonly refetchOnReconnect?: boolean;
  readonly retry?: boolean | number;
  readonly retryDelay?: number | ((retryCount: number) => number);
  readonly onSuccess?: (data: T) => void;
  readonly onError?: (error: QueryError) => void;
  readonly onSettled?: (data: T | undefined, error: QueryError | null) => void;
}

/**
 * Mutation options interface
 */
export interface MutationOptions<TData, TVariables> {
  readonly onSuccess?: (data: TData, variables: TVariables) => void;
  readonly onError?: (error: QueryError, variables: TVariables) => void;
  readonly onSettled?: (data: TData | undefined, error: QueryError | null, variables: TVariables) => void;
  readonly retry?: boolean | number;
  readonly retryDelay?: number | ((retryCount: number) => number);
}

/**
 * Infinite query parameters
 */
export interface InfiniteQueryParams<T> extends BaseQueryParams {
  readonly getNextPageParam: (lastPage: T, allPages: T[]) => unknown;
  readonly getPreviousPageParam: (firstPage: T, allPages: T[]) => unknown;
}

/**
 * Paginated query result
 */
export interface PaginatedQueryResult<T> extends QueryResult<T[]> {
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly fetchNextPage: () => Promise<unknown>;
  readonly fetchPreviousPage: () => Promise<unknown>;
}
