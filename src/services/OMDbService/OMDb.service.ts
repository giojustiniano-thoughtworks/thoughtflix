import { ApiService } from '../ApiService';
import { 
  type OMDbConfig, 
  type OMDbSearchParams, 
  type OMDbMovieParams,
  type OMDbSearchResponse,
  type OMDbMovie
} from '../../types/omdb.types';
import { type HeadersDefaults, type AxiosHeaderValue } from 'axios';
import { type Movie, type HeroMovie } from '../../types/movie.types';
import { 
  transformOMDbSearchResultToMovie, 
  transformOMDbMovieToHeroMovie 
} from '../../utils/dataTransformers';
import { QUERY_CONFIG, getCurrentYear, getNextYear } from '../../utils/queryUtils';

/**
 * OMDb API service for fetching movie data
 * Extends the base ApiService to provide OMDb-specific functionality
 */
export class OMDbService {
  private apiService: ApiService;
  private config: {
    apiKey: string | null;
    timeout: number;
    baseURL?: string;
  };

  constructor(config: OMDbConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: config.timeout,
    };
    this.apiService = new ApiService({
      baseURL: config.baseURL,
      timeout: config.timeout,
      defaultHeaders: {
        common: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        delete: {},
        get: {},
        head: {},
        post: {},
        put: {},
        patch: {},
      } as HeadersDefaults & { [key: string]: AxiosHeaderValue },
    });
  }

  /**
   * Search for movies by title
   */
  async searchMovies(params: OMDbSearchParams): Promise<OMDbSearchResponse> {
    const searchParams = {
      apikey: this.config.apiKey,
      s: params.s,
      ...(params.type && { type: params.type }),
      ...(params.y && { y: params.y }),
      ...(params.page && { page: params.page }),
    };

    const response = await this.apiService.get<OMDbSearchResponse>('/', searchParams);
    return response.data;
  }

  /**
   * Get movie details by title
   */
  async getMovieByTitle(params: OMDbMovieParams): Promise<OMDbMovie> {
    const movieParams = {
      apikey: this.config.apiKey,
      t: params.t,
      ...(params.type && { type: params.type }),
      ...(params.y && { y: params.y }),
      ...(params.plot && { plot: params.plot }),
    };

    const response = await this.apiService.get<OMDbMovie>('/', movieParams);
    return response.data;
  }

  /**
   * Get movie details by IMDb ID
   */
  async getMovieById(params: OMDbMovieParams): Promise<OMDbMovie> {
    const movieParams = {
      apikey: this.config.apiKey,
      i: params.i,
      ...(params.plot && { plot: params.plot }),
    };

    const response = await this.apiService.get<OMDbMovie>('/', movieParams);
    return response.data;
  }

  /**
   * Update the API key
   */
  updateApiKey(newApiKey: string): void {
    this.config.apiKey = newApiKey;
  }

  /**
   * Get the current API key
   */
  getApiKey(): string | null {
    return this.config.apiKey;
  }

  /**
   * Get current configuration
   */
  getConfig(): OMDbConfig {
    return { ...this.config };
  }

  /**
   * Get popular movies by searching for recent movies
   * Since OMDb doesn't have a direct "popular" endpoint, we'll search for recent movies
   */
  async getPopularMovies(params: { page?: number; year?: string } = {}): Promise<{ results: Movie[] }> {
    const searchYear = params.year || getCurrentYear();
    
    // Search for movies from the current year
    const searchResponse = await this.searchMovies({
      s: 'movie',
      type: 'movie',
      y: searchYear,
      page: params.page || 1,
    });

    if (searchResponse.Response === 'False' || !searchResponse.Search) {
      return { results: [] };
    }

    // Convert OMDb search results to Movie objects
    const movies = searchResponse.Search.map(transformOMDbSearchResultToMovie);
    return { results: movies };
  }

  /**
   * Get top rated movies by searching for movies with high ratings
   * Since OMDb doesn't have a direct "top rated" endpoint, we'll search for movies with specific criteria
   * Optimized to avoid making individual API calls for each movie
   */
  async getTopRatedMovies(params: { page?: number; year?: string } = {}): Promise<{ results: Movie[] }> {
    const searchYear = params.year || getCurrentYear();
    
    // Search for movies from the current year
    const searchResponse = await this.searchMovies({
      s: 'movie',
      type: 'movie',
      y: searchYear,
      page: params.page || 1,
    });

    if (searchResponse.Response === 'False' || !searchResponse.Search) {
      return { results: [] };
    }

    // Convert search results to Movie objects directly without individual API calls
    // This avoids the cascade of API calls that was causing the infinite loop
    const movies = searchResponse.Search
      .map(transformOMDbSearchResultToMovie)
      .filter(movie => movie.vote_average >= QUERY_CONFIG.RATING_THRESHOLD)
      .sort((a, b) => b.vote_average - a.vote_average);

    return { results: movies };
  }

  /**
   * Get upcoming movies by searching for movies from next year
   */
  async getUpcomingMovies(params: { page?: number } = {}): Promise<{ results: Movie[] }> {
    const nextYear = getNextYear();
    
    const searchResponse = await this.searchMovies({
      s: 'movie',
      type: 'movie',
      y: nextYear,
      page: params.page || 1,
    });

    if (searchResponse.Response === 'False' || !searchResponse.Search) {
      return { results: [] };
    }

    // Convert OMDb search results to Movie objects
    const movies = searchResponse.Search.map(transformOMDbSearchResultToMovie);
    return { results: movies };
  }

  /**
   * Get movie details by IMDb ID and return as HeroMovie
   */
  async getMovieDetails(imdbId: string): Promise<HeroMovie> {
    const movie = await this.getMovieById({ i: imdbId, plot: 'full' });
    return transformOMDbMovieToHeroMovie(movie);
  }

}
