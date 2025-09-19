// Common types and interfaces used across the application

/**
 * Base props interface for all components
 */
export interface BaseComponentProps {
  /** Additional CSS class name */
  readonly className?: string;
  /** Whether the component is disabled */
  readonly disabled?: boolean;
  /** Whether the component is in loading state */
  readonly loading?: boolean;
  /** Test ID for testing purposes */
  readonly 'data-testid'?: string;
}

/**
 * Base props for interactive components
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  /** Whether the component is hoverable */
  readonly hoverable?: boolean;
  /** Whether the component is focusable */
  readonly focusable?: boolean;
}

/**
 * Base props for components with click handlers
 */
export interface ClickableComponentProps<T = unknown> extends InteractiveComponentProps {
  /** Callback function called when component is clicked */
  readonly onClick?: (data: T) => void;
  /** Callback function called when component receives keyboard events */
  readonly onKeyDown?: (event: React.KeyboardEvent) => void;
}

/**
 * Base props for components with focus handlers
 */
export interface FocusableComponentProps extends InteractiveComponentProps {
  /** Callback function called when component gains focus */
  readonly onFocus?: () => void;
  /** Callback function called when component loses focus */
  readonly onBlur?: () => void;
}

/**
 * Base props for components with clear functionality
 */
export interface ClearableComponentProps extends FocusableComponentProps {
  /** Callback function called when component is cleared */
  readonly onClear?: () => void;
  /** Whether to show clear button */
  readonly showClearButton?: boolean;
}

/**
 * Base props for components with error states
 */
export interface ErrorComponentProps extends BaseComponentProps {
  /** Error message to display */
  readonly error?: string | null;
  /** Callback function called when retry is requested */
  readonly onRetry?: () => void;
}

/**
 * Base props for components with loading states
 */
export interface LoadingComponentProps extends BaseComponentProps {
  /** Whether the component is in loading state */
  readonly loading?: boolean;
  /** Loading message to display */
  readonly loadingMessage?: string;
}

/**
 * Base props for components with size variants
 */
export interface SizableComponentProps extends BaseComponentProps {
  /** Size variant of the component */
  readonly size?: 'small' | 'medium' | 'large';
}

/**
 * Base props for components with variant styles
 */
export interface VariantComponentProps extends BaseComponentProps {
  /** Style variant of the component */
  readonly variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

/**
 * Common callback types
 */
export type VoidCallback = () => void;
export type StringCallback = (value: string) => void;
export type NumberCallback = (value: number) => void;
export type BooleanCallback = (value: boolean) => void;

/**
 * Common generic callback types
 */
export type GenericCallback<T> = (value: T) => void;
export type AsyncCallback<T> = (value: T) => Promise<void>;
export type EventCallback<T = React.SyntheticEvent> = (event: T) => void;

/**
 * Common state types
 */
export interface LoadingState {
  readonly isLoading: boolean;
  readonly loadingMessage?: string;
}

export interface ErrorState {
  readonly error: string | null;
  readonly hasError: boolean;
}

export interface AsyncState<T> extends LoadingState, ErrorState {
  readonly data: T | null;
  readonly isSuccess: boolean;
}

/**
 * Common configuration types
 */
export interface BaseConfig {
  readonly timeout?: number;
  readonly retries?: number;
  readonly enabled?: boolean;
}

export interface ApiConfig extends BaseConfig {
  readonly baseURL: string;
  readonly headers?: Record<string, string>;
}

/**
 * Common pagination types
 */
export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
  readonly offset?: number;
}

export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly hasMore: boolean;
}

/**
 * Common filter types
 */
export interface BaseFilter {
  readonly search?: string;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

export interface DateRangeFilter extends BaseFilter {
  readonly startDate?: string;
  readonly endDate?: string;
}

/**
 * Common validation types
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code?: string;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: ValidationError[];
}

/**
 * Common utility types
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type NonNullable<T> = T extends null | undefined ? never : T;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Common event handler types
 */
export type KeyboardEventHandler = (event: React.KeyboardEvent) => void;
export type MouseEventHandler = (event: React.MouseEvent) => void;
export type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type FocusEventHandler = (event: React.FocusEvent) => void;
export type BlurEventHandler = (event: React.FocusEvent) => void;
