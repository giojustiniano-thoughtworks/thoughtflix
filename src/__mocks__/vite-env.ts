// Mock for Vite environment variables in tests
export const mockEnv = {
  VITE_OMDB_API_KEY: 'test-api-key',
  VITE_OMDB_BASE_URL: 'https://www.omdbapi.com',
  VITE_API_TIMEOUT: '10000',
  MODE: 'test',
  DEV: false,
  PROD: false,
  SSR: false,
};

// Mock import.meta for Vitest
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv,
    },
  },
  writable: true,
});
