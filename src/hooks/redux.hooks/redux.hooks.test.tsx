import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import {
  useUIActions,
  useMovieActions,
  useUISelectors,
  useMovieSelectors,
  useAppSelectors,
  useAppActions,
} from './redux.hooks';
import { 
  setupCommonMocks,
  createTestStore,
  resetAllMocks
} from '../../__mocks__/testUtils';
import { ReduxWrapper } from '../../__mocks__/testMocks';
import { mockHeroMovie, mockSection } from '../../__mocks__/testData';

// Setup common mocks
setupCommonMocks();

// Note: The "No reducer provided for key 'ui'" warning is a non-critical warning
// that appears during test setup but doesn't affect test functionality.
// All tests pass successfully despite this warning.

// Mock the api.config module to avoid import.meta issues
vi.mock('../../config/api.config', () => ({
  getApiConfig: vi.fn(() => ({
    omdb: {
      apiKey: 'test-key',
      baseURL: 'https://test.com',
      timeout: 10000,
    },
  })),
  isApiConfigValid: vi.fn(() => true),
}));

// Test wrapper component
const createTestWrapper = (store: ReturnType<typeof createTestStore>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <ReduxWrapper store={store}>{children}</ReduxWrapper>
  );
};

describe('Redux Hooks', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    resetAllMocks();
    store = createTestStore();
  });

  describe('useUIActions', () => {
    it('GIVEN useUIActions hook WHEN called THEN should return UI action functions', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);

      // WHEN
      const { result } = renderHook(() => useUIActions(), { wrapper });

      // THEN
      expect(result.current.setCurrentSection).toBeInstanceOf(Function);
      expect(result.current.toggleSearch).toBeInstanceOf(Function);
      expect(result.current.setSearchOpen).toBeInstanceOf(Function);
      expect(result.current.setMovieModalOpen).toBeInstanceOf(Function);
      expect(result.current.setSelectedMovie).toBeInstanceOf(Function);
      expect(result.current.setGlobalLoading).toBeInstanceOf(Function);
      expect(result.current.addNotification).toBeInstanceOf(Function);
      expect(result.current.removeNotification).toBeInstanceOf(Function);
      expect(result.current.clearNotifications).toBeInstanceOf(Function);
    });

    it('GIVEN useUIActions hook WHEN setCurrentSection is called THEN should update current section', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);
      const { result } = renderHook(() => useUIActions(), { wrapper });

      // WHEN
      act(() => {
        result.current.setCurrentSection('movies');
      });

      // THEN
      const state = store.getState();
      expect(state.ui.currentSection).toBe('movies');
    });

    it('GIVEN useUIActions hook WHEN toggleSearch is called THEN should toggle search state', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);
      const { result } = renderHook(() => useUIActions(), { wrapper });
      const initialState = store.getState().ui.isSearchOpen;

      // WHEN
      act(() => {
        result.current.toggleSearch();
      });

      // THEN
      const newState = store.getState();
      expect(newState.ui.isSearchOpen).toBe(!initialState);
    });
  });

  describe('useMovieActions', () => {
    it('GIVEN useMovieActions hook WHEN called THEN should return movie action functions', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);

      // WHEN
      const { result } = renderHook(() => useMovieActions(), { wrapper });

      // THEN
      expect(result.current.setHeroMovie).toBeInstanceOf(Function);
      expect(result.current.setSections).toBeInstanceOf(Function);
      expect(result.current.setSearchResults).toBeInstanceOf(Function);
      expect(result.current.setSearchQuery).toBeInstanceOf(Function);
      expect(result.current.setLoading).toBeInstanceOf(Function);
      expect(result.current.setError).toBeInstanceOf(Function);
      expect(result.current.clearErrors).toBeInstanceOf(Function);
      expect(result.current.setPagination).toBeInstanceOf(Function);
      expect(result.current.resetMoviesState).toBeInstanceOf(Function);
      expect(result.current.fetchHomePageData).toBeInstanceOf(Function);
      expect(result.current.searchMovies).toBeInstanceOf(Function);
    });

    it('GIVEN useMovieActions hook WHEN setHeroMovie is called THEN should update hero movie', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);
      const { result } = renderHook(() => useMovieActions(), { wrapper });

      // WHEN
      act(() => {
        result.current.setHeroMovie(mockHeroMovie);
      });

      // THEN
      const state = store.getState();
      expect(state.movies.heroMovie).toEqual(mockHeroMovie);
    });

    it('GIVEN useMovieActions hook WHEN setSections is called THEN should update sections', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);
      const { result } = renderHook(() => useMovieActions(), { wrapper });
      const sections = [mockSection];

      // WHEN
      act(() => {
        result.current.setSections(sections);
      });

      // THEN
      const state = store.getState();
      expect(state.movies.sections).toEqual(sections);
    });
  });

  describe('useUISelectors', () => {
    it('GIVEN useUISelectors hook WHEN called THEN should return UI state values', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);

      // WHEN
      const { result } = renderHook(() => useUISelectors(), { wrapper });

      // THEN
      expect(result.current.currentSection).toBe('home');
      expect(result.current.isSearchOpen).toBe(false);
      expect(result.current.isMovieModalOpen).toBe(false);
      expect(result.current.selectedMovie).toBeNull();
      expect(result.current.isGlobalLoading).toBe(false);
      expect(result.current.notifications).toEqual([]);
    });

    it('GIVEN useUISelectors hook WHEN state changes THEN should return updated values', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);
      const { result } = renderHook(() => useUISelectors(), { wrapper });

      // WHEN
      act(() => {
        store.dispatch({ type: 'ui/setCurrentSection', payload: 'movies' });
      });

      // THEN
      expect(result.current.currentSection).toBe('movies');
    });
  });

  describe('useMovieSelectors', () => {
    it('GIVEN useMovieSelectors hook WHEN called THEN should return movie state values', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);

      // WHEN
      const { result } = renderHook(() => useMovieSelectors(), { wrapper });

      // THEN
      expect(result.current.heroMovie).toBeNull();
      expect(result.current.sections).toEqual([]);
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.searchQuery).toBe('');
      expect(result.current.isLoadingHero).toBe(false);
      expect(result.current.isLoadingSections).toBe(false);
      expect(result.current.isLoadingSearch).toBe(false);
      expect(result.current.heroError).toBeNull();
      expect(result.current.sectionsError).toBeNull();
      expect(result.current.searchError).toBeNull();
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(0);
    });

    it('GIVEN useMovieSelectors hook WHEN state changes THEN should return updated values', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);
      const { result } = renderHook(() => useMovieSelectors(), { wrapper });

      // WHEN
      act(() => {
        store.dispatch({ type: 'movies/setHeroMovie', payload: mockHeroMovie });
      });

      // THEN
      expect(result.current.heroMovie).toEqual(mockHeroMovie);
    });
  });

  describe('useAppSelectors', () => {
    it('GIVEN useAppSelectors hook WHEN called THEN should return combined state values', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);

      // WHEN
      const { result } = renderHook(() => useAppSelectors(), { wrapper });

      // THEN
      // UI selectors
      expect(result.current.currentSection).toBe('home');
      expect(result.current.isSearchOpen).toBe(false);
      expect(result.current.isMovieModalOpen).toBe(false);
      expect(result.current.selectedMovie).toBeNull();
      expect(result.current.isGlobalLoading).toBe(false);
      expect(result.current.notifications).toEqual([]);
      
      // Movie selectors
      expect(result.current.heroMovie).toBeNull();
      expect(result.current.sections).toEqual([]);
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.searchQuery).toBe('');
      expect(result.current.isLoadingHero).toBe(false);
      expect(result.current.isLoadingSections).toBe(false);
      expect(result.current.isLoadingSearch).toBe(false);
      expect(result.current.heroError).toBeNull();
      expect(result.current.sectionsError).toBeNull();
      expect(result.current.searchError).toBeNull();
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(0);
    });
  });

  describe('useAppActions', () => {
    it('GIVEN useAppActions hook WHEN called THEN should return combined action functions', () => {
      // GIVEN
      const wrapper = createTestWrapper(store);

      // WHEN
      const { result } = renderHook(() => useAppActions(), { wrapper });

      // THEN
      // UI actions
      expect(result.current.setCurrentSection).toBeInstanceOf(Function);
      expect(result.current.toggleSearch).toBeInstanceOf(Function);
      expect(result.current.setSearchOpen).toBeInstanceOf(Function);
      expect(result.current.setMovieModalOpen).toBeInstanceOf(Function);
      expect(result.current.setSelectedMovie).toBeInstanceOf(Function);
      expect(result.current.setGlobalLoading).toBeInstanceOf(Function);
      expect(result.current.addNotification).toBeInstanceOf(Function);
      expect(result.current.removeNotification).toBeInstanceOf(Function);
      expect(result.current.clearNotifications).toBeInstanceOf(Function);
      
      // Movie actions
      expect(result.current.setHeroMovie).toBeInstanceOf(Function);
      expect(result.current.setSections).toBeInstanceOf(Function);
      expect(result.current.setSearchResults).toBeInstanceOf(Function);
      expect(result.current.setSearchQuery).toBeInstanceOf(Function);
      expect(result.current.setLoading).toBeInstanceOf(Function);
      expect(result.current.setError).toBeInstanceOf(Function);
      expect(result.current.clearErrors).toBeInstanceOf(Function);
      expect(result.current.setPagination).toBeInstanceOf(Function);
      expect(result.current.resetMoviesState).toBeInstanceOf(Function);
      expect(result.current.fetchHomePageData).toBeInstanceOf(Function);
      expect(result.current.searchMovies).toBeInstanceOf(Function);
    });
  });
});
