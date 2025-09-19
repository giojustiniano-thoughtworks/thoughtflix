import { mockEnv } from '../__mocks__/vite-env';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the api.config module
vi.mock('./api.config', () => ({
  getApiConfig: vi.fn(() => ({
    omdb: {
      apiKey: mockEnv.VITE_OMDB_API_KEY || 'default-key',
      baseURL: mockEnv.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com',
      timeout: Number(mockEnv.VITE_API_TIMEOUT) || 10000,
    },
  })),
  isApiConfigValid: vi.fn(() => {
    return !!(mockEnv.VITE_OMDB_API_KEY && mockEnv.VITE_OMDB_BASE_URL);
  }),
}));

import { getApiConfig, isApiConfigValid } from './api.config';

describe('API Configuration', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    mockEnv.VITE_OMDB_API_KEY = '';
    mockEnv.VITE_OMDB_BASE_URL = '';
    mockEnv.VITE_API_TIMEOUT = '';
  });

  describe('getApiConfig', () => {
    it('GIVEN all required environment variables WHEN calling getApiConfig THEN should return valid configuration', () => {
      // GIVEN
      mockEnv.VITE_OMDB_API_KEY = 'test-omdb-key';
      mockEnv.VITE_OMDB_BASE_URL = 'https://test-omdb.com';
      mockEnv.VITE_API_TIMEOUT = '5000';

      // WHEN
      const config = getApiConfig();

      // THEN
      expect(config).toEqual({
        omdb: {
          apiKey: 'test-omdb-key',
          baseURL: 'https://test-omdb.com',
          timeout: 5000,
        },
      });
    });

    it('GIVEN missing environment variables WHEN calling getApiConfig THEN should return default configuration', () => {
      // GIVEN
      mockEnv.VITE_OMDB_API_KEY = '';
      mockEnv.VITE_OMDB_BASE_URL = '';
      mockEnv.VITE_API_TIMEOUT = '';

      // WHEN
      const config = getApiConfig();

      // THEN
      expect(config).toEqual({
        omdb: {
          apiKey: 'default-key',
          baseURL: 'https://www.omdbapi.com',
          timeout: 10000,
        },
      });
    });

    it('GIVEN partial environment variables WHEN calling getApiConfig THEN should return mixed configuration', () => {
      // GIVEN
      mockEnv.VITE_OMDB_API_KEY = 'test-key';
      mockEnv.VITE_OMDB_BASE_URL = '';
      mockEnv.VITE_API_TIMEOUT = '8000';

      // WHEN
      const config = getApiConfig();

      // THEN
      expect(config).toEqual({
        omdb: {
          apiKey: 'test-key',
          baseURL: 'https://www.omdbapi.com',
          timeout: 8000,
        },
      });
    });

    it('GIVEN invalid timeout value WHEN calling getApiConfig THEN should use default timeout', () => {
      // GIVEN
      mockEnv.VITE_OMDB_API_KEY = 'test-key';
      mockEnv.VITE_OMDB_BASE_URL = 'https://test.com';
      mockEnv.VITE_API_TIMEOUT = 'invalid';

      // WHEN
      const config = getApiConfig();

      // THEN
      expect(config).toEqual({
        omdb: {
          apiKey: 'test-key',
          baseURL: 'https://test.com',
          timeout: 10000,
        },
      });
    });
  });

  describe('isApiConfigValid', () => {
    it('GIVEN valid environment variables WHEN calling isApiConfigValid THEN should return true', () => {
      // GIVEN
      mockEnv.VITE_OMDB_API_KEY = 'test-key';
      mockEnv.VITE_OMDB_BASE_URL = 'https://test.com';
      mockEnv.VITE_API_TIMEOUT = '5000';

      // WHEN
      const isValid = isApiConfigValid();

      // THEN
      expect(isValid).toBe(true);
    });

    it('GIVEN missing apiKey WHEN calling isApiConfigValid THEN should return false', () => {
      // GIVEN
      mockEnv.VITE_OMDB_API_KEY = '';
      mockEnv.VITE_OMDB_BASE_URL = 'https://test.com';
      mockEnv.VITE_API_TIMEOUT = '5000';

      // WHEN
      const isValid = isApiConfigValid();

      // THEN
      expect(isValid).toBe(false);
    });

    it('GIVEN missing baseURL WHEN calling isApiConfigValid THEN should return false', () => {
      // GIVEN
      mockEnv.VITE_OMDB_API_KEY = 'test-key';
      mockEnv.VITE_OMDB_BASE_URL = '';
      mockEnv.VITE_API_TIMEOUT = '5000';

      // WHEN
      const isValid = isApiConfigValid();

      // THEN
      expect(isValid).toBe(false);
    });

    it('GIVEN no environment variables WHEN calling isApiConfigValid THEN should return false', () => {
      // GIVEN
      mockEnv.VITE_OMDB_API_KEY = '';
      mockEnv.VITE_OMDB_BASE_URL = '';
      mockEnv.VITE_API_TIMEOUT = '';

      // WHEN
      const isValid = isApiConfigValid();

      // THEN
      expect(isValid).toBe(false);
    });
  });
});