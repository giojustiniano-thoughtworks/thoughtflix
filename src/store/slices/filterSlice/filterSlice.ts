import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type MovieFilters, type MovieFilterOptions } from '../../../types/movie.types';

/**
 * Initial state for filter slice
 */
const initialState = {
  isFilterOpen: false,
  movieFilters: {
    selectedGenres: [] as number[],
    selectedLanguages: [] as string[],
    selectedReleaseYears: [] as number[],
    sortBy: 'popularity' as MovieFilters['sortBy'],
    sortOrder: 'desc' as MovieFilters['sortOrder'],
  },
  availableFilterOptions: {
    genres: [] as { id: number; name: string }[],
    languages: [] as { code: string; name: string }[],
    releaseYears: [] as number[],
  },
};

/**
 * Filter slice
 */
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    /**
     * Toggle filter open/closed
     */
    toggleFilter: (state) => {
      state.isFilterOpen = !state.isFilterOpen;
    },

    /**
     * Set filter open state
     */
    setFilterOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterOpen = action.payload;
    },

    /**
     * Update movie filters
     */
    updateFilters: (state, action: PayloadAction<Partial<MovieFilters>>) => {
      state.movieFilters = { ...state.movieFilters, ...action.payload };
    },

    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.movieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };
    },

    /**
     * Set available filter options
     */
    setAvailableOptions: (state, action: PayloadAction<MovieFilterOptions>) => {
      state.availableFilterOptions = action.payload;
    },

    /**
     * Reset filter state to initial state
     */
    resetFilterState: () => {
      return { ...initialState };
    },
  },
});

export const {
  toggleFilter,
  setFilterOpen,
  updateFilters,
  clearFilters,
  setAvailableOptions,
  resetFilterState,
} = filterSlice.actions;

export default filterSlice.reducer;
