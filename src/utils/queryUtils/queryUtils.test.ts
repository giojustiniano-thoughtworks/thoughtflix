import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  QUERY_CONFIG, 
  createOMDbService, 
  transformToQueryError, 
  withQueryErrorHandling,
  getCurrentYear,
  getNextYear
} from './queryUtils';
import { OMDbService } from '../../services/OMDbService';
import { getApiConfig } from '../../config/api.config';

// Mock dependencies
vi.mock('../../services/OMDbService');
vi.mock('../../config/api.config');

const mockOMDbService = vi.mocked(OMDbService);
const mockGetApiConfig = vi.mocked(getApiConfig);

describe('queryUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('QUERY_CONFIG constants', () => {
    it('GIVEN QUERY_CONFIG WHEN accessed THEN should have correct stale time values', () => {
      // GIVEN
      const expectedStaleTimes = {
        HOMEPAGE: 5 * 60 * 1000, // 5 minutes
        SEARCH: 2 * 60 * 1000, // 2 minutes
        MOVIE_DETAILS: 10 * 60 * 1000, // 10 minutes
        MOVIES: 5 * 60 * 1000, // 5 minutes
      };

      // WHEN & THEN
      expect(QUERY_CONFIG.STALE_TIME).toEqual(expectedStaleTimes);
    });

    it('GIVEN QUERY_CONFIG WHEN accessed THEN should have correct GC time values', () => {
      // GIVEN
      const expectedGcTimes = {
        HOMEPAGE: 10 * 60 * 1000, // 10 minutes
        SEARCH: 5 * 60 * 1000, // 5 minutes
        MOVIE_DETAILS: 30 * 60 * 1000, // 30 minutes
        MOVIES: 10 * 60 * 1000, // 10 minutes
      };

      // WHEN & THEN
      expect(QUERY_CONFIG.GC_TIME).toEqual(expectedGcTimes);
    });

    it('GIVEN QUERY_CONFIG WHEN accessed THEN should have correct rating threshold', () => {
      // GIVEN & WHEN & THEN
      expect(QUERY_CONFIG.RATING_THRESHOLD).toBe(7.0);
    });

    it('GIVEN QUERY_CONFIG WHEN accessed THEN should have correct movies per section limit', () => {
      // GIVEN & WHEN & THEN
      expect(QUERY_CONFIG.MOVIES_PER_SECTION).toBe(10);
    });
  });

  describe('createOMDbService', () => {
    it('GIVEN valid API config WHEN creating OMDb service THEN should return service instance', () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);
      const mockServiceInstance = {};
      mockOMDbService.mockImplementation(() => mockServiceInstance as unknown as OMDbService);

      // WHEN
      const result = createOMDbService();

      // THEN
      expect(mockGetApiConfig).toHaveBeenCalledOnce();
      expect(mockOMDbService).toHaveBeenCalledWith(mockConfig.omdb);
      expect(result).toBe(mockServiceInstance);
    });

    it('GIVEN missing API key WHEN creating OMDb service THEN should throw error', () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: '',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);

      // WHEN & THEN
      expect(() => createOMDbService()).toThrow('API configuration is invalid');
    });

    it('GIVEN missing base URL WHEN creating OMDb service THEN should throw error', () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: '',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);

      // WHEN & THEN
      expect(() => createOMDbService()).toThrow('API configuration is invalid');
    });

    it('GIVEN null API key WHEN creating OMDb service THEN should throw error', () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: null,
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);

      // WHEN & THEN
      expect(() => createOMDbService()).toThrow('API configuration is invalid');
    });

    it('GIVEN undefined base URL WHEN creating OMDb service THEN should throw error', () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: undefined,
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);

      // WHEN & THEN
      expect(() => createOMDbService()).toThrow('API configuration is invalid');
    });
  });

  describe('transformToQueryError', () => {
    it.each([
      {
        description: 'Error instance with message',
        input: new Error('Test error message'),
        expected: {
          message: 'Test error message',
          status: undefined,
          code: undefined,
        },
      },
      {
        description: 'Error instance with status and code',
        input: Object.assign(new Error('Network error'), { status: 500, code: 'NETWORK_ERROR' }),
        expected: {
          message: 'Network error',
          status: 500,
          code: 'NETWORK_ERROR',
        },
      },
      {
        description: 'String error',
        input: 'String error message',
        expected: {
          message: 'Unknown error occurred',
          status: undefined,
          code: undefined,
        },
      },
      {
        description: 'Number error',
        input: 404,
        expected: {
          message: 'Unknown error occurred',
          status: undefined,
          code: undefined,
        },
      },
      {
        description: 'Object error with message property',
        input: { message: 'Custom error', status: 400 },
        expected: {
          message: 'Unknown error occurred',
          status: 400,
          code: undefined,
        },
      },
      {
        description: 'Null error',
        input: null,
        expected: {
          message: 'Unknown error occurred',
          status: undefined,
          code: undefined,
        },
      },
      {
        description: 'Undefined error',
        input: undefined,
        expected: {
          message: 'Unknown error occurred',
          status: undefined,
          code: undefined,
        },
      },
    ])('GIVEN $description WHEN transforming to QueryError THEN should return correct format', ({ input, expected }) => {
      // GIVEN & WHEN
      const result = transformToQueryError(input);

      // THEN
      expect(result).toEqual(expected);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('code');
    });
  });

  describe('withQueryErrorHandling', () => {
    it('GIVEN successful query function WHEN executing with error handling THEN should return result', async () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);
      const mockServiceInstance = { testMethod: vi.fn() };
      mockOMDbService.mockImplementation(() => mockServiceInstance as unknown as OMDbService);
      
      const expectedResult = { data: 'test result' };
      const queryFn = vi.fn().mockResolvedValue(expectedResult);

      // WHEN
      const result = await withQueryErrorHandling(queryFn);

      // THEN
      expect(queryFn).toHaveBeenCalledWith(mockServiceInstance);
      expect(result).toEqual(expectedResult);
    });

    it('GIVEN query function that throws error WHEN executing with error handling THEN should throw transformed error', async () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);
      const mockServiceInstance = {};
      mockOMDbService.mockImplementation(() => mockServiceInstance as unknown as OMDbService);
      
      const originalError = new Error('Query failed');
      const queryFn = vi.fn().mockRejectedValue(originalError);

      // WHEN & THEN
      await expect(withQueryErrorHandling(queryFn)).rejects.toThrow('Query failed');
    });

    it('GIVEN query function that throws error with status WHEN executing with error handling THEN should preserve error properties', async () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);
      const mockServiceInstance = {};
      mockOMDbService.mockImplementation(() => mockServiceInstance as unknown as OMDbService);
      
      const originalError = Object.assign(new Error('Network error'), { status: 500, code: 'NETWORK_ERROR' });
      const queryFn = vi.fn().mockRejectedValue(originalError);

      // WHEN & THEN
      await expect(withQueryErrorHandling(queryFn)).rejects.toMatchObject({
        message: 'Network error',
        status: 500,
        code: 'NETWORK_ERROR',
      });
    });

    it('GIVEN invalid API config WHEN executing with error handling THEN should throw configuration error', async () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: '',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);
      const queryFn = vi.fn();

      // WHEN & THEN
      await expect(withQueryErrorHandling(queryFn)).rejects.toThrow('API configuration is invalid');
      expect(queryFn).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentYear', () => {
    it('GIVEN current date WHEN getting current year THEN should return current year as string', () => {
      // GIVEN
      const currentYear = new Date().getFullYear();
      const expectedYear = currentYear.toString();

      // WHEN
      const result = getCurrentYear();

      // THEN
      expect(result).toBe(expectedYear);
      expect(typeof result).toBe('string');
    });

    it('GIVEN different years WHEN getting current year THEN should return correct year for each', () => {
      // GIVEN
      const testCases = [
        { year: 2020, expected: '2020' },
        { year: 2023, expected: '2023' },
        { year: 2025, expected: '2025' },
      ];

      testCases.forEach(({ year, expected }) => {
        // WHEN
        vi.setSystemTime(new Date(year, 0, 1));
        const result = getCurrentYear();

        // THEN
        expect(result).toBe(expected);
      });
    });
  });

  describe('getNextYear', () => {
    it('GIVEN current date WHEN getting next year THEN should return next year as string', () => {
      // GIVEN
      const currentYear = new Date().getFullYear();
      const expectedNextYear = (currentYear + 1).toString();

      // WHEN
      const result = getNextYear();

      // THEN
      expect(result).toBe(expectedNextYear);
      expect(typeof result).toBe('string');
    });

    it('GIVEN different years WHEN getting next year THEN should return correct next year for each', () => {
      // GIVEN
      const testCases = [
        { year: 2020, expected: '2021' },
        { year: 2023, expected: '2024' },
        { year: 2025, expected: '2026' },
      ];

      testCases.forEach(({ year, expected }) => {
        // WHEN
        vi.setSystemTime(new Date(year, 0, 1));
        const result = getNextYear();

        // THEN
        expect(result).toBe(expected);
      });
    });

    it('GIVEN leap year WHEN getting next year THEN should return correct next year', () => {
      // GIVEN
      const leapYear = 2024;
      const expectedNextYear = '2025';

      // WHEN
      vi.setSystemTime(new Date(leapYear, 1, 29)); // Feb 29, 2024
      const result = getNextYear();

      // THEN
      expect(result).toBe(expectedNextYear);
    });

    it('GIVEN year boundary WHEN getting next year THEN should handle year transition correctly', () => {
      // GIVEN
      const year = 2023;

      // WHEN
      vi.setSystemTime(new Date(year, 11, 31, 23, 59, 59)); // Dec 31, 2023
      const result = getNextYear();

      // THEN
      expect(result).toBe('2024');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('GIVEN query function that returns undefined WHEN executing with error handling THEN should return undefined', async () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);
      const mockServiceInstance = {};
      mockOMDbService.mockImplementation(() => mockServiceInstance as unknown as OMDbService);
      
      const queryFn = vi.fn().mockResolvedValue(undefined);

      // WHEN
      const result = await withQueryErrorHandling(queryFn);

      // THEN
      expect(result).toBeUndefined();
    });

    it('GIVEN query function that returns null WHEN executing with error handling THEN should return null', async () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);
      const mockServiceInstance = {};
      mockOMDbService.mockImplementation(() => mockServiceInstance as unknown as OMDbService);
      
      const queryFn = vi.fn().mockResolvedValue(null);

      // WHEN
      const result = await withQueryErrorHandling(queryFn);

      // THEN
      expect(result).toBeNull();
    });

    it('GIVEN query function that returns complex object WHEN executing with error handling THEN should return the object', async () => {
      // GIVEN
      const mockConfig = {
        omdb: {
          apiKey: 'test-api-key',
          baseURL: 'https://api.example.com',
          timeout: 10000,
        },
      };
      mockGetApiConfig.mockReturnValue(mockConfig);
      const mockServiceInstance = {};
      mockOMDbService.mockImplementation(() => mockServiceInstance as unknown as OMDbService);
      
      const complexObject = {
        data: { movies: [] },
        metadata: { total: 0, page: 1 },
        status: 'success',
      };
      const queryFn = vi.fn().mockResolvedValue(complexObject);

      // WHEN
      const result = await withQueryErrorHandling(queryFn);

      // THEN
      expect(result).toEqual(complexObject);
    });
  });
});
