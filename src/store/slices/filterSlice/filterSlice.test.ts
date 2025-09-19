import { describe, it, expect, beforeEach } from 'vitest';
import filterSlice, {
  toggleFilter,
  setFilterOpen,
  updateFilters,
  clearFilters,
  setAvailableOptions,
  resetFilterState,
} from './filterSlice';
import { type MovieFilters, type MovieFilterOptions } from '../../../types/movie.types';

describe('Filter Slice', () => {
  const mockInitialState = {
    isFilterOpen: false,
    movieFilters: {
      selectedGenres: [],
      selectedLanguages: [],
      selectedReleaseYears: [],
      sortBy: 'popularity' as const,
      sortOrder: 'desc' as const,
    },
    availableFilterOptions: {
      genres: [],
      languages: [],
      releaseYears: [],
    },
  };

  const mockGenres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
  ];

  const mockLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
  ];

  const mockYears = [2023, 2022, 2021, 2020];

  const mockFilterOptions: MovieFilterOptions = {
    genres: mockGenres,
    languages: mockLanguages,
    releaseYears: mockYears,
  };

  beforeEach(() => {
    // Reset state before each test
  });

  describe('Initial State', () => {
    it('GIVEN initial state WHEN filter slice is created THEN should have correct default values', () => {
      // GIVEN
      const initialState = filterSlice(undefined, { type: 'unknown' });

      // THEN
      expect(initialState.isFilterOpen).toBe(false);
      expect(initialState.movieFilters).toEqual({
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      });
      expect(initialState.availableFilterOptions).toEqual({
        genres: [],
        languages: [],
        releaseYears: [],
      });
    });
  });

  describe('Toggle Filter', () => {
    it('GIVEN filter is closed WHEN toggleFilter is dispatched THEN should open filter', () => {
      // GIVEN
      const state = { ...mockInitialState, isFilterOpen: false };

      // WHEN
      const newState = filterSlice(state, toggleFilter());

      // THEN
      expect(newState.isFilterOpen).toBe(true);
    });

    it('GIVEN filter is open WHEN toggleFilter is dispatched THEN should close filter', () => {
      // GIVEN
      const state = { ...mockInitialState, isFilterOpen: true };

      // WHEN
      const newState = filterSlice(state, toggleFilter());

      // THEN
      expect(newState.isFilterOpen).toBe(false);
    });
  });

  describe('Set Filter Open', () => {
    it('GIVEN any filter state WHEN setFilterOpen(true) is dispatched THEN should open filter', () => {
      // GIVEN
      const state = { ...mockInitialState, isFilterOpen: false };

      // WHEN
      const newState = filterSlice(state, setFilterOpen(true));

      // THEN
      expect(newState.isFilterOpen).toBe(true);
    });

    it('GIVEN any filter state WHEN setFilterOpen(false) is dispatched THEN should close filter', () => {
      // GIVEN
      const state = { ...mockInitialState, isFilterOpen: true };

      // WHEN
      const newState = filterSlice(state, setFilterOpen(false));

      // THEN
      expect(newState.isFilterOpen).toBe(false);
    });
  });

  describe('Update Filters', () => {
    it('GIVEN current filters WHEN updateFilters is dispatched THEN should update filters', () => {
      // GIVEN
      const state = { ...mockInitialState };
      const newFilters: MovieFilters = {
        selectedGenres: [1, 2],
        selectedLanguages: ['en'],
        selectedReleaseYears: [2023],
        sortBy: 'release_date',
        sortOrder: 'asc',
      };

      // WHEN
      const newState = filterSlice(state, updateFilters(newFilters));

      // THEN
      expect(newState.movieFilters).toEqual(newFilters);
    });

    it('GIVEN current filters WHEN updateFilters with partial data is dispatched THEN should merge with existing filters', () => {
      // GIVEN
      const state = {
        ...mockInitialState,
        movieFilters: {
          selectedGenres: [1],
          selectedLanguages: ['en'],
          selectedReleaseYears: [2023],
          sortBy: 'popularity' as const,
          sortOrder: 'desc' as const,
        },
      };
      const partialFilters: Partial<MovieFilters> = {
        selectedGenres: [1, 2, 3],
        sortBy: 'vote_average',
      };

      // WHEN
      const newState = filterSlice(state, updateFilters(partialFilters));

      // THEN
      expect(newState.movieFilters.selectedGenres).toEqual([1, 2, 3]);
      expect(newState.movieFilters.selectedLanguages).toEqual(['en']);
      expect(newState.movieFilters.selectedReleaseYears).toEqual([2023]);
      expect(newState.movieFilters.sortBy).toBe('vote_average');
      expect(newState.movieFilters.sortOrder).toBe('desc');
    });
  });

  describe('Clear Filters', () => {
    it('GIVEN filters with selections WHEN clearFilters is dispatched THEN should reset to default filters', () => {
      // GIVEN
      const state = {
        ...mockInitialState,
        movieFilters: {
          selectedGenres: [1, 2, 3],
          selectedLanguages: ['en', 'es'],
          selectedReleaseYears: [2023, 2022],
          sortBy: 'release_date' as const,
          sortOrder: 'asc' as const,
        },
      };

      // WHEN
      const newState = filterSlice(state, clearFilters());

      // THEN
      expect(newState.movieFilters).toEqual({
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      });
    });
  });

  describe('Set Available Options', () => {
    it('GIVEN empty available options WHEN setAvailableOptions is dispatched THEN should set available options', () => {
      // GIVEN
      const state = { ...mockInitialState };

      // WHEN
      const newState = filterSlice(state, setAvailableOptions(mockFilterOptions));

      // THEN
      expect(newState.availableFilterOptions).toEqual(mockFilterOptions);
    });

    it('GIVEN existing available options WHEN setAvailableOptions is dispatched THEN should replace available options', () => {
      // GIVEN
      const state = {
        ...mockInitialState,
        availableFilterOptions: {
          genres: [{ id: 1, name: 'Action' }],
          languages: [{ code: 'en', name: 'English' }],
          releaseYears: [2023],
        },
      };

      // WHEN
      const newState = filterSlice(state, setAvailableOptions(mockFilterOptions));

      // THEN
      expect(newState.availableFilterOptions).toEqual(mockFilterOptions);
    });
  });

  describe('Reset Filter State', () => {
    it('GIVEN any filter state WHEN resetFilterState is dispatched THEN should return to initial state', () => {
      // GIVEN
      const state = {
        isFilterOpen: true,
        movieFilters: {
          selectedGenres: [1, 2, 3],
          selectedLanguages: ['en', 'es'],
          selectedReleaseYears: [2023, 2022],
          sortBy: 'release_date' as const,
          sortOrder: 'asc' as const,
        },
        availableFilterOptions: mockFilterOptions,
      };

      // WHEN
      const newState = filterSlice(state, resetFilterState());

      // THEN
      expect(newState).toEqual(mockInitialState);
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN unknown action WHEN filter slice reducer is called THEN should return current state', () => {
      // GIVEN
      const state = { ...mockInitialState };
      const unknownAction = { type: 'unknown/action' };

      // WHEN
      const newState = filterSlice(state, unknownAction);

      // THEN
      expect(newState).toBe(state);
    });

    it('GIVEN empty arrays in filters WHEN updateFilters is dispatched THEN should handle empty arrays correctly', () => {
      // GIVEN
      const state = { ...mockInitialState };
      const emptyFilters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'title',
        sortOrder: 'asc',
      };

      // WHEN
      const newState = filterSlice(state, updateFilters(emptyFilters));

      // THEN
      expect(newState.movieFilters).toEqual(emptyFilters);
    });
  });
});
