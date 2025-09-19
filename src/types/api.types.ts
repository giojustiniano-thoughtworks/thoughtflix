import type { AxiosHeaderValue, HeadersDefaults } from "axios";

// Base API response interface
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

// Base error interface - used across the application
export interface BaseError {
  message: string;
  status?: number;
  code?: string;
}

// API-specific error interface
export interface ApiError extends BaseError {
  status: number; // Required for API errors
}

// HTTP methods const assertion
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];

// Request configuration interface
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
}

// Base API configuration interface
export interface BaseApiConfig {
  readonly timeout: number;
  readonly baseURL?: string;
}

// Full API configuration interface with headers
export interface ApiConfig extends BaseApiConfig {
  readonly defaultHeaders: HeadersDefaults & {
    [key: string]: AxiosHeaderValue
  };
}

// Note: Movie types are defined in movie.types.ts to avoid duplication

