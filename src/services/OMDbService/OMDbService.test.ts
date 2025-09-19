import { OMDbService } from './OMDb.service';
import { vi, describe, it, expect, beforeEach, type MockedObject } from 'vitest';
import { type OMDbConfig, type OMDbSearchParams, type OMDbMovieParams } from '../../types/omdb.types';
import { ApiService } from '../ApiService';

// Mock the ApiService
vi.mock('../ApiService');
const MockedApiService = vi.mocked(ApiService);

describe('OMDbService', () => {
  let omdbService: OMDbService;
  let mockApiService: MockedObject<ApiService>;
  let mockConfig: OMDbConfig;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockConfig = {
      apiKey: 'test-api-key',
      baseURL: 'https://www.omdbapi.com',
      timeout: 5000,
    };

    // Create mock instance
    mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      request: vi.fn(),
      updateBaseURL: vi.fn(),
      updateHeaders: vi.fn(),
      getConfig: vi.fn(),
    } as MockedObject<ApiService>;

    // Mock the constructor
    MockedApiService.mockImplementation(() => mockApiService);

    omdbService = new OMDbService(mockConfig);
  });

  describe('Constructor and Initialization', () => {
    it('GIVEN a valid OMDb configuration WHEN creating OMDbService instance THEN should initialize with correct config', () => {
      // GIVEN
      const config: OMDbConfig = {
        apiKey: 'test-key',
        baseURL: 'https://www.omdbapi.com',
        timeout: 10000,
      };

      // WHEN
      new OMDbService(config);

      // THEN
      expect(MockedApiService).toHaveBeenCalledWith({
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
        },
      });
    });
  });

  describe('Search Movies', () => {
    it('GIVEN a valid search term WHEN searching for movies THEN should return search results', async () => {
      // GIVEN
      const searchParams: OMDbSearchParams = {
        s: 'Inception',
        type: 'movie',
        page: 1,
      };
      const mockResponse = {
        data: {
          Search: [
            {
              Title: 'Inception',
              Year: '2010',
              imdbID: 'tt1375666',
              Type: 'movie',
              Poster: 'https://example.com/poster.jpg',
            },
          ],
          totalResults: '1',
          Response: 'True',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.searchMovies(searchParams);

      // THEN
      expect(mockApiService.get).toHaveBeenCalledWith('/', {
        apikey: mockConfig.apiKey,
        s: 'Inception',
        type: 'movie',
        page: 1,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('GIVEN a search term without optional parameters WHEN searching for movies THEN should return search results with defaults', async () => {
      // GIVEN
      const searchParams: OMDbSearchParams = {
        s: 'Batman',
      };
      const mockResponse = {
        data: {
          Search: [
            {
              Title: 'Batman',
              Year: '1989',
              imdbID: 'tt0096895',
              Type: 'movie',
              Poster: 'https://example.com/poster.jpg',
            },
          ],
          totalResults: '1',
          Response: 'True',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.searchMovies(searchParams);

      // THEN
      expect(mockApiService.get).toHaveBeenCalledWith('/', {
        apikey: mockConfig.apiKey,
        s: 'Batman',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('GIVEN a search term that returns no results WHEN searching for movies THEN should return empty results', async () => {
      // GIVEN
      const searchParams: OMDbSearchParams = {
        s: 'NonExistentMovie12345',
      };
      const mockResponse = {
        data: {
          Search: [],
          totalResults: '0',
          Response: 'False',
          Error: 'Movie not found!',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.searchMovies(searchParams);

      // THEN
      expect(result).toEqual(mockResponse.data);
      expect(result.Search).toHaveLength(0);
    });
  });

  describe('Get Movie by Title', () => {
    it('GIVEN a valid movie title WHEN getting movie by title THEN should return movie details', async () => {
      // GIVEN
      const movieParams: OMDbMovieParams = {
        t: 'Inception',
        plot: 'full',
      };
      const mockResponse = {
        data: {
          Title: 'Inception',
          Year: '2010',
          Rated: 'PG-13',
          Released: '16 Jul 2010',
          Runtime: '148 min',
          Genre: 'Action, Sci-Fi, Thriller',
          Director: 'Christopher Nolan',
          Writer: 'Christopher Nolan',
          Actors: 'Leonardo DiCaprio, Marion Cotillard, Tom Hardy',
          Plot: 'A thief who steals corporate secrets...',
          Language: 'English, Japanese, French',
          Country: 'United States, United Kingdom',
          Awards: 'Won 4 Oscars. 157 wins & 220 nominations total.',
          Poster: 'https://example.com/poster.jpg',
          Ratings: [
            { Source: 'Internet Movie Database', Value: '8.8/10' },
            { Source: 'Rotten Tomatoes', Value: '87%' },
          ],
          Metascore: '74',
          imdbRating: '8.8',
          imdbVotes: '2,123,456',
          imdbID: 'tt1375666',
          Type: 'movie',
          DVD: '07 Dec 2010',
          BoxOffice: '$292,576,195',
          Production: 'Warner Bros. Pictures',
          Website: 'N/A',
          Response: 'True',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.getMovieByTitle(movieParams);

      // THEN
      expect(mockApiService.get).toHaveBeenCalledWith('/', {
        apikey: mockConfig.apiKey,
        t: 'Inception',
        plot: 'full',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('GIVEN a movie title that does not exist WHEN getting movie by title THEN should return error response', async () => {
      // GIVEN
      const movieParams: OMDbMovieParams = {
        t: 'NonExistentMovie12345',
      };
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Movie not found!',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.getMovieByTitle(movieParams);

      // THEN
      expect(result.Response).toBe('False');
      expect(result.Error).toBe('Movie not found!');
    });
  });

  describe('Get Movie by IMDb ID', () => {
    it('GIVEN a valid IMDb ID WHEN getting movie by ID THEN should return movie details', async () => {
      // GIVEN
      const movieParams: OMDbMovieParams = {
        i: 'tt1375666',
        plot: 'short',
      };
      const mockResponse = {
        data: {
          Title: 'Inception',
          Year: '2010',
          imdbID: 'tt1375666',
          Type: 'movie',
          Response: 'True',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.getMovieById(movieParams);

      // THEN
      expect(mockApiService.get).toHaveBeenCalledWith('/', {
        apikey: mockConfig.apiKey,
        i: 'tt1375666',
        plot: 'short',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('GIVEN an invalid IMDb ID WHEN getting movie by ID THEN should return error response', async () => {
      // GIVEN
      const movieParams: OMDbMovieParams = {
        i: 'invalid-id',
      };
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Incorrect IMDb ID.',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.getMovieById(movieParams);

      // THEN
      expect(result.Response).toBe('False');
      expect(result.Error).toBe('Incorrect IMDb ID.');
    });
  });

  describe('Error Handling', () => {
    it('GIVEN a network error WHEN making API request THEN should throw error', async () => {
      // GIVEN
      const searchParams: OMDbSearchParams = { s: 'Inception' };
      const networkError = {
        message: 'Network error - no response received',
        status: 0,
        code: 'NETWORK_ERROR',
      };
      mockApiService.get.mockRejectedValue(networkError);

      // WHEN & THEN
      await expect(omdbService.searchMovies(searchParams)).rejects.toEqual(networkError);
    });

    it('GIVEN a server error WHEN making API request THEN should throw error', async () => {
      // GIVEN
      const searchParams: OMDbSearchParams = { s: 'Inception' };
      const serverError = {
        message: 'Server error occurred',
        status: 500,
        code: 'SERVER_ERROR',
      };
      mockApiService.get.mockRejectedValue(serverError);

      // WHEN & THEN
      await expect(omdbService.searchMovies(searchParams)).rejects.toEqual(serverError);
    });

    it('GIVEN an invalid API key WHEN making API request THEN should return error response', async () => {
      // GIVEN
      const searchParams: OMDbSearchParams = { s: 'Inception' };
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Invalid API key!',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.searchMovies(searchParams);

      // THEN
      expect(result.Response).toBe('False');
      expect(result.Error).toBe('Invalid API key!');
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN empty search term WHEN searching for movies THEN should handle gracefully', async () => {
      // GIVEN
      const searchParams: OMDbSearchParams = { s: '' };
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Something went wrong.',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.searchMovies(searchParams);

      // THEN
      expect(result.Response).toBe('False');
    });

    it('GIVEN special characters in search term WHEN searching for movies THEN should encode properly', async () => {
      // GIVEN
      const searchParams: OMDbSearchParams = { s: 'The Lord of the Rings: The Fellowship of the Ring' };
      const mockResponse = {
        data: {
          Search: [],
          totalResults: '0',
          Response: 'True',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      await omdbService.searchMovies(searchParams);

      // THEN
      expect(mockApiService.get).toHaveBeenCalledWith('/', {
        apikey: mockConfig.apiKey,
        s: 'The Lord of the Rings: The Fellowship of the Ring',
      });
    });

    it('GIVEN very long search term WHEN searching for movies THEN should handle properly', async () => {
      // GIVEN
      const longTitle = 'A'.repeat(1000);
      const searchParams: OMDbSearchParams = { s: longTitle };
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Too many results.',
        },
        status: 200,
        success: true,
      };
      mockApiService.get.mockResolvedValue(mockResponse);

      // WHEN
      const result = await omdbService.searchMovies(searchParams);

      // THEN
      expect(result.Response).toBe('False');
    });
  });

  describe('Configuration Management', () => {
    it('GIVEN a new API key WHEN updating configuration THEN should update the service', () => {
      // GIVEN
      const newApiKey = 'new-api-key';

      // WHEN
      omdbService.updateApiKey(newApiKey);

      // THEN
      expect(omdbService.getApiKey()).toBe(newApiKey);
    });

    it('GIVEN a request WHEN getting current configuration THEN should return current config', () => {
      // WHEN
      const config = omdbService.getConfig();

      // THEN
      expect(config).toEqual(mockConfig);
    });
  });
});
