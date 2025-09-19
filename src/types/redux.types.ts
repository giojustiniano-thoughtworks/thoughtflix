import { type Movie, type HeroMovie, type MovieSection, type MovieFilters, type MovieFilterOptions } from './movie.types';

/**
 * Root state interface for the Redux store
 */
export interface RootState {
  movies: MovieState;
  ui: UIState;
}

/**
 * Movie-related state interface
 */
export interface MovieState {
  // Homepage data
  heroMovie: HeroMovie | null;
  sections: MovieSection[];
  
  // Search results
  searchResults: Movie[];
  searchQuery: string;
  
  // Loading states
  isLoadingHero: boolean;
  isLoadingSections: boolean;
  isLoadingSearch: boolean;
  
  // Error states
  heroError: string | null;
  sectionsError: string | null;
  searchError: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
}

/**
 * UI-related state interface
 */
export interface UIState {
  // Navigation
  currentSection: string;
  isSearchOpen: boolean;
  
  // Modals and overlays
  isMovieModalOpen: boolean;
  selectedMovie: Movie | null;
  
  // Loading indicators
  isGlobalLoading: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Filter state
  isFilterOpen: boolean;
  movieFilters: MovieFilters;
  availableFilterOptions: MovieFilterOptions;
}

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  duration?: number; // in milliseconds, undefined means persistent
}

/**
 * Async thunk status
 */
export type AsyncStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: AsyncStatus;
  error: string | null;
}

/**
 * Movie search parameters
 */
export interface MovieSearchParams {
  query: string;
  page?: number;
  year?: string;
}

/**
 * Movie fetch parameters
 */
export interface MovieFetchParams {
  page?: number;
  year?: string;
}

