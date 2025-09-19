import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UIState, type Notification } from '../../../types/redux.types';
import { type Movie } from '../../../types/movie.types';

/**
 * Initial state for UI slice
 */
const initialState: UIState = {
  currentSection: 'home',
  isSearchOpen: false,
  isMovieModalOpen: false,
  selectedMovie: null,
  isGlobalLoading: false,
  notifications: [],
  isFilterOpen: false,
  movieFilters: {
    selectedGenres: [],
    selectedLanguages: [],
    selectedReleaseYears: [],
    sortBy: 'popularity',
    sortOrder: 'desc',
  },
  availableFilterOptions: {
    genres: [],
    languages: [],
    releaseYears: [],
  },
};

/**
 * Generate a unique ID for notifications
 */
const generateNotificationId = (): string => {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * UI slice
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Set current section
     */
    setCurrentSection: (state, action: PayloadAction<string>) => {
      state.currentSection = action.payload;
    },

    /**
     * Toggle search open/closed
     */
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },

    /**
     * Set search open state
     */
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },

    /**
     * Set movie modal open state
     */
    setMovieModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isMovieModalOpen = action.payload;
    },

    /**
     * Set selected movie
     */
    setSelectedMovie: (state, action: PayloadAction<Movie | null>) => {
      state.selectedMovie = action.payload;
    },

    /**
     * Set global loading state
     */
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isGlobalLoading = action.payload;
    },

    /**
     * Add notification
     */
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'> & { id?: string; timestamp?: number }>) => {
      const notification: Notification = {
        id: action.payload.id || generateNotificationId(),
        timestamp: action.payload.timestamp || Date.now(),
        type: action.payload.type,
        message: action.payload.message,
        duration: action.payload.duration,
      };
      state.notifications.push(notification);
    },

    /**
     * Remove notification by id
     */
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },

    /**
     * Clear all notifications
     */
    clearNotifications: (state) => {
      state.notifications = [];
    },

    /**
     * Reset UI state to initial state
     */
    resetUIState: () => {
      return { ...initialState };
    },
  },
});

export const {
  setCurrentSection,
  toggleSearch,
  setSearchOpen,
  setMovieModalOpen,
  setSelectedMovie,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  resetUIState,
} = uiSlice.actions;

export default uiSlice.reducer;
