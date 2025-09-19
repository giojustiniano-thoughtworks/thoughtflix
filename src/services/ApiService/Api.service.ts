import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type HeadersDefaults, type AxiosHeaderValue } from 'axios';
import { type ApiResponse, type ApiError, type RequestConfig, type ApiConfig, HttpMethod } from '../../types/api.types';

/**
 * Base API service class that provides common HTTP methods and error handling
 * This service will be extended by specific API services (e.g., MovieService)
 */
export class ApiService {
  private axiosInstance: AxiosInstance;
  private config: {
    timeout: number;
    defaultHeaders: HeadersDefaults & { [key: string]: AxiosHeaderValue };
    baseURL?: string;
  };

  constructor(config: ApiConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.defaultHeaders,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors for common functionality
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add any common request logic here (e.g., auth tokens)
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: HttpMethod.GET, url, params });
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>({ method: HttpMethod.POST, url, data });
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>({ method: HttpMethod.PUT, url, data });
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: HttpMethod.DELETE, url });
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>({ method: HttpMethod.PATCH, url, data });
  }

  /**
   * Generic request method that handles all HTTP methods
   */
  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        method: config.method,
        url: config.url,
        headers: config.headers,
        params: config.params,
        data: config.data,
        timeout: config.timeout || this.config.timeout,
      };

      const response: AxiosResponse<T> = await this.axiosInstance.request(axiosConfig);

      return {
        data: response.data,
        status: response.status,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors and convert them to ApiError format
   */
  private handleError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data?: { message?: string; code?: string }; status: number }; message?: string };
      // Server responded with error status
      return {
        message: axiosError.response.data?.message || axiosError.message || 'Server error occurred',
        status: axiosError.response.status,
        code: axiosError.response.data?.code,
      };
    } else if (error && typeof error === 'object' && 'request' in error) {
      // Request was made but no response received
      return {
        message: 'Network error - no response received',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    } else {
      // Something else happened
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return {
        message: errorMessage,
        status: 0,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Update the base URL
   */
  updateBaseURL(newBaseURL: string): void {
    this.config.baseURL = newBaseURL;
    this.axiosInstance.defaults.baseURL = newBaseURL;
  }

  /**
   * Update default headers
   */
  updateHeaders(headers: Record<string, string>): void {
    this.config.defaultHeaders = { ...this.config.defaultHeaders, ...headers };
    this.axiosInstance.defaults.headers = { 
      ...this.axiosInstance.defaults.headers, 
      ...headers 
    } as HeadersDefaults & { [key: string]: AxiosHeaderValue };
  }

  /**
   * Get current configuration
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }
}
