import { ApiService } from './Api.service';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import { type ApiConfig, HttpMethod } from '../../types/api.types';
import axios, { type AxiosHeaderValue, type AxiosInstance, type HeadersDefaults } from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('ApiService', () => {
  let apiService: ApiService;
  let mockAxiosInstance: AxiosInstance & {
    request: MockedFunction<AxiosInstance['request']>;
  };

  const mockConfig: ApiConfig = {
    baseURL: 'https://api.example.com',
    timeout: 5000,
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
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock axios instance
    mockAxiosInstance = {
      request: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      head: vi.fn(),
      options: vi.fn(),
      getUri: vi.fn(),
      create: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn(),
          clear: vi.fn()
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
          clear: vi.fn()
        },
      },
      defaults: {
        baseURL: mockConfig.baseURL,
        headers: mockConfig.defaultHeaders as HeadersDefaults & { [key: string]: AxiosHeaderValue; },
      },
    } as unknown as AxiosInstance & {
      request: MockedFunction<AxiosInstance['request']>;
    };

    // Mock axios.create to return our mock instance
    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    // Create new ApiService instance
    apiService = new ApiService(mockConfig);
  });

  describe('Constructor and Initialization', () => {
    it('GIVEN a valid configuration WHEN creating ApiService instance THEN should initialize with correct config', () => {
      // GIVEN
      const config: ApiConfig = {
        baseURL: 'https://test-api.com',
        timeout: 10000,
        defaultHeaders: {
          common: { 'Authorization': 'Bearer token' },
          delete: {},
          get: {},
          head: {},
          post: {},
          put: {},
          patch: {},
        } as HeadersDefaults & { [key: string]: AxiosHeaderValue },
      };

      // WHEN
      new ApiService(config);

      // THEN
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: config.baseURL,
        timeout: config.timeout,
        headers: config.defaultHeaders,
      });
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('GET Requests', () => {
    it('GIVEN a valid URL and params WHEN making GET request THEN should return successful response', async () => {
      // GIVEN
      const url = '/movies';
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        data: { movies: [] },
        status: 200,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.get(url, params);

      // THEN
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: HttpMethod.GET,
        url,
        headers: undefined,
        params,
        data: undefined,
        timeout: mockConfig.timeout,
      });
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200,
        success: true,
      });
    });

    it('GIVEN a valid URL without params WHEN making GET request THEN should return successful response', async () => {
      // GIVEN
      const url = '/movies';
      const mockResponse = {
        data: { movies: [] },
        status: 200,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.get(url);

      // THEN
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: HttpMethod.GET,
        url,
        headers: undefined,
        params: undefined,
        data: undefined,
        timeout: mockConfig.timeout,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('POST Requests', () => {
    it('GIVEN a valid URL and data WHEN making POST request THEN should return successful response', async () => {
      // GIVEN
      const url = '/movies';
      const data = { title: 'Test Movie', year: 2023 };
      const mockResponse = {
        data: { id: '123', ...data },
        status: 201,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.post(url, data);

      // THEN
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: HttpMethod.POST,
        url,
        headers: undefined,
        params: undefined,
        data,
        timeout: mockConfig.timeout,
      });
      expect(result).toEqual({
        data: mockResponse.data,
        status: 201,
        success: true,
      });
    });

    it('GIVEN a valid URL without data WHEN making POST request THEN should return successful response', async () => {
      // GIVEN
      const url = '/movies';
      const mockResponse = {
        data: { success: true },
        status: 200,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.post(url);

      // THEN
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: HttpMethod.POST,
        url,
        headers: undefined,
        params: undefined,
        data: undefined,
        timeout: mockConfig.timeout,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('PUT Requests', () => {
    it('GIVEN a valid URL and data WHEN making PUT request THEN should return successful response', async () => {
      // GIVEN
      const url = '/movies/123';
      const data = { title: 'Updated Movie' };
      const mockResponse = {
        data: { id: '123', ...data },
        status: 200,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.put(url, data);

      // THEN
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: HttpMethod.PUT,
        url,
        headers: undefined,
        params: undefined,
        data,
        timeout: mockConfig.timeout,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('DELETE Requests', () => {
    it('GIVEN a valid URL WHEN making DELETE request THEN should return successful response', async () => {
      // GIVEN
      const url = '/movies/123';
      const mockResponse = {
        data: { success: true },
        status: 204,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.delete(url);

      // THEN
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: HttpMethod.DELETE,
        url,
        headers: undefined,
        params: undefined,
        data: undefined,
        timeout: mockConfig.timeout,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('PATCH Requests', () => {
    it('GIVEN a valid URL and data WHEN making PATCH request THEN should return successful response', async () => {
      // GIVEN
      const url = '/movies/123';
      const data = { title: 'Partially Updated Movie' };
      const mockResponse = {
        data: { id: '123', ...data },
        status: 200,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.patch(url, data);

      // THEN
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: HttpMethod.PATCH,
        url,
        headers: undefined,
        params: undefined,
        data,
        timeout: mockConfig.timeout,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('GIVEN a server error response WHEN making request THEN should throw ApiError with server details', async () => {
      // GIVEN
      const url = '/movies';
      const serverError = {
        response: {
          status: 404,
          data: {
            message: 'Movie not found',
            code: 'MOVIE_NOT_FOUND',
          },
        },
      };
      mockAxiosInstance.request.mockRejectedValue(serverError);

      // WHEN & THEN
      await expect(apiService.get(url)).rejects.toEqual({
        message: 'Movie not found',
        status: 404,
        code: 'MOVIE_NOT_FOUND',
      });
    });

    it('GIVEN a network error WHEN making request THEN should throw ApiError with network details', async () => {
      // GIVEN
      const url = '/movies';
      const networkError = {
        request: {},
        message: 'Network Error',
      };
      mockAxiosInstance.request.mockRejectedValue(networkError);

      // WHEN & THEN
      await expect(apiService.get(url)).rejects.toEqual({
        message: 'Network error - no response received',
        status: 0,
        code: 'NETWORK_ERROR',
      });
    });

    it('GIVEN an unknown error WHEN making request THEN should throw ApiError with unknown details', async () => {
      // GIVEN
      const url = '/movies';
      const unknownError = {
        message: 'Something went wrong',
      };
      mockAxiosInstance.request.mockRejectedValue(unknownError);

      // WHEN & THEN
      await expect(apiService.get(url)).rejects.toEqual({
        message: 'An unexpected error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR',
      });
    });

    it('GIVEN a server error without message WHEN making request THEN should throw ApiError with default message', async () => {
      // GIVEN
      const url = '/movies';
      const serverError = {
        response: {
          status: 500,
          data: {},
        },
        message: 'Request failed with status code 500',
      };
      mockAxiosInstance.request.mockRejectedValue(serverError);

      // WHEN & THEN
      await expect(apiService.get(url)).rejects.toEqual({
        message: 'Request failed with status code 500',
        status: 500,
        code: undefined,
      });
    });
  });

  describe('Configuration Management', () => {
    it('GIVEN a new base URL WHEN updating base URL THEN should update axios instance', () => {
      // GIVEN
      const newBaseURL = 'https://new-api.com';

      // WHEN
      apiService.updateBaseURL(newBaseURL);

      // THEN
      expect(apiService.getConfig().baseURL).toBe(newBaseURL);
      expect(mockAxiosInstance.defaults.baseURL).toBe(newBaseURL);
    });

    it('GIVEN new headers WHEN updating headers THEN should merge with existing headers', () => {
      // GIVEN
      const newHeaders = {
        'Authorization': 'Bearer new-token',
        'X-Custom-Header': 'custom-value',
      };

      // WHEN
      apiService.updateHeaders(newHeaders);

      // THEN
      const config = apiService.getConfig();
      expect(config.defaultHeaders).toEqual({
        ...mockConfig.defaultHeaders,
        ...newHeaders,
      });
      expect(mockAxiosInstance.defaults.headers).toEqual({
        ...mockConfig.defaultHeaders,
        ...newHeaders,
      } as unknown as HeadersDefaults & { [key: string]: AxiosHeaderValue });
    });

    it('GIVEN a request WHEN getting current config THEN should return current configuration', () => {
      // WHEN
      const config = apiService.getConfig();

      // THEN
      expect(config).toEqual(mockConfig);
    });
  });

  describe('Request with Custom Configuration', () => {
    it('GIVEN custom headers and timeout WHEN making request THEN should use custom values', async () => {
      // GIVEN
      const url = '/movies';
      const customHeaders = { 'X-Custom': 'value' };
      const customTimeout = 10000;
      const mockResponse = {
        data: { movies: [] },
        status: 200,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.request({
        method: HttpMethod.GET,
        url,
        headers: customHeaders,
        timeout: customTimeout,
      });

      // THEN
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: HttpMethod.GET,
        url,
        headers: customHeaders,
        params: undefined,
        data: undefined,
        timeout: customTimeout,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN empty response data WHEN making request THEN should handle empty data correctly', async () => {
      // GIVEN
      const url = '/movies';
      const mockResponse = {
        data: null,
        status: 204,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.get(url);

      // THEN
      expect(result.data).toBeNull();
      expect(result.success).toBe(true);
    });

    it('GIVEN undefined response data WHEN making request THEN should handle undefined data correctly', async () => {
      // GIVEN
      const url = '/movies';
      const mockResponse = {
        data: undefined,
        status: 200,
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      // WHEN
      const result = await apiService.get(url);

      // THEN
      expect(result.data).toBeUndefined();
      expect(result.success).toBe(true);
    });
  });
});
