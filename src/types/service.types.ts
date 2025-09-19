// Service-related types and interfaces

import { type BaseApiConfig, type ApiResponse, type BaseError } from './api.types';

/**
 * Base service configuration interface
 */
export interface BaseServiceConfig extends BaseApiConfig {
  readonly retries?: number;
  readonly retryDelay?: number;
  readonly enabled?: boolean;
}

/**
 * Service error interface
 */
export interface ServiceError extends BaseError {
  readonly service: string;
  readonly operation: string;
  readonly timestamp: Date;
}

/**
 * Service response wrapper
 */
export interface ServiceResponse<T> extends ApiResponse<T> {
  readonly service: string;
  readonly operation: string;
  readonly timestamp: Date;
}

/**
 * Service method configuration
 */
export interface ServiceMethodConfig {
  readonly timeout?: number;
  readonly retries?: number;
  readonly enabled?: boolean;
}

/**
 * Service health check interface
 */
export interface ServiceHealth {
  readonly isHealthy: boolean;
  readonly status: 'healthy' | 'degraded' | 'unhealthy';
  readonly lastCheck: Date;
  readonly responseTime?: number;
  readonly error?: string;
}

/**
 * Service metrics interface
 */
export interface ServiceMetrics {
  readonly totalRequests: number;
  readonly successfulRequests: number;
  readonly failedRequests: number;
  readonly averageResponseTime: number;
  readonly lastRequestTime?: Date;
}

/**
 * Base service interface
 */
export interface BaseService {
  readonly config: BaseServiceConfig;
  readonly isHealthy: () => Promise<ServiceHealth>;
  readonly getMetrics: () => ServiceMetrics;
  readonly resetMetrics: () => void;
}

/**
 * Service factory interface
 */
export interface ServiceFactory<T extends BaseService> {
  create(config: BaseServiceConfig): T;
  getInstance(config: BaseServiceConfig): T;
}

/**
 * Service registry interface
 */
export interface ServiceRegistry {
  readonly register: <T extends BaseService>(name: string, service: T) => void;
  readonly get: <T extends BaseService>(name: string) => T | undefined;
  readonly unregister: (name: string) => void;
  readonly list: () => string[];
}

/**
 * Service lifecycle hooks
 */
export interface ServiceLifecycle {
  readonly onInit?: () => Promise<void>;
  readonly onDestroy?: () => Promise<void>;
  readonly onError?: (error: ServiceError) => Promise<void>;
}

/**
 * Service middleware interface
 */
export interface ServiceMiddleware<T = unknown> {
  readonly beforeRequest?: (config: T) => Promise<T>;
  readonly afterResponse?: <R>(response: R) => Promise<R>;
  readonly onError?: (error: ServiceError) => Promise<void>;
}

/**
 * Service cache interface
 */
export interface ServiceCache {
  readonly get: <T>(key: string) => Promise<T | null>;
  readonly set: <T>(key: string, value: T, ttl?: number) => Promise<void>;
  readonly delete: (key: string) => Promise<void>;
  readonly clear: () => Promise<void>;
  readonly has: (key: string) => Promise<boolean>;
}

/**
 * Service rate limiting interface
 */
export interface ServiceRateLimit {
  readonly maxRequests: number;
  readonly windowMs: number;
  readonly currentRequests: number;
  readonly resetTime: Date;
  readonly isLimited: boolean;
}

/**
 * Service configuration validation
 */
export interface ServiceConfigValidation {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
}

/**
 * Service factory configuration
 */
export interface ServiceFactoryConfig {
  readonly defaultConfig: BaseServiceConfig;
  readonly middleware: ServiceMiddleware[];
  readonly cache?: ServiceCache;
  readonly rateLimit?: ServiceRateLimit;
  readonly healthCheckInterval?: number;
}

/**
 * Service dependency injection
 */
export interface ServiceDependencies {
  readonly [key: string]: BaseService;
}

/**
 * Service context interface
 */
export interface ServiceContext {
  readonly requestId: string;
  readonly userId?: string;
  readonly timestamp: Date;
  readonly metadata: Record<string, unknown>;
}

/**
 * Service operation interface
 */
export interface ServiceOperation<T = unknown, R = unknown> {
  readonly name: string;
  readonly execute: (params: T, context?: ServiceContext) => Promise<R>;
  readonly validate?: (params: T) => boolean;
  readonly transform?: (params: T) => T;
}

/**
 * Service batch operation interface
 */
export interface ServiceBatchOperation<T = unknown, R = unknown> {
  readonly operations: ServiceOperation<T, R>[];
  readonly execute: (params: T[], context?: ServiceContext) => Promise<R[]>;
  readonly executeParallel: (params: T[], context?: ServiceContext) => Promise<R[]>;
}

/**
 * Service event interface
 */
export interface ServiceEvent<T = unknown> {
  readonly type: string;
  readonly data: T;
  readonly timestamp: Date;
  readonly source: string;
}

/**
 * Service event emitter interface
 */
export interface ServiceEventEmitter {
  readonly emit: <T>(event: ServiceEvent<T>) => void;
  readonly on: <T>(eventType: string, handler: (event: ServiceEvent<T>) => void) => void;
  readonly off: <T>(eventType: string, handler: (event: ServiceEvent<T>) => void) => void;
  readonly once: <T>(eventType: string, handler: (event: ServiceEvent<T>) => void) => void;
}
