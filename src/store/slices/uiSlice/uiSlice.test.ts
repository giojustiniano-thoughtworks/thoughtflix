import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach } from 'vitest';
import uiReducer, {
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
} from './uiSlice';
import { type Movie } from '../../../types/movie.types';
import { type Notification } from '../../../types/redux.types';

describe('UI Slice', () => {
  let store: ReturnType<typeof configureStore<{ ui: ReturnType<typeof uiReducer> }>>;

  const mockMovie: Movie = {
    id: 'tt1234567',
    title: 'Test Movie',
    overview: 'Test overview',
    poster_path: '/movie.jpg',
    backdrop_path: '/movie_backdrop.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [],
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie',
    popularity: 0,
    video: false,
  };

  const mockNotification: Notification = {
    id: 'test-notification-1',
    type: 'success',
    message: 'Test notification',
    timestamp: Date.now(),
    duration: 5000,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ui: uiReducer,
      },
    });
  });

  describe('Initial State', () => {
    it('GIVEN initial state WHEN UI slice is created THEN should have correct default values', () => {
      // GIVEN
      const initialState = store.getState().ui;

      // WHEN & THEN
      expect(initialState.currentSection).toBe('home');
      expect(initialState.isSearchOpen).toBe(false);
      expect(initialState.isMovieModalOpen).toBe(false);
      expect(initialState.selectedMovie).toBeNull();
      expect(initialState.isGlobalLoading).toBe(false);
      expect(initialState.notifications).toEqual([]);
    });
  });

  describe('Navigation Actions', () => {
    it('GIVEN setCurrentSection action WHEN dispatched THEN should update current section', () => {
      // GIVEN
      const section = 'movies';

      // WHEN
      store.dispatch(setCurrentSection(section));

      // THEN
      const newState = store.getState().ui;
      expect(newState.currentSection).toBe(section);
    });

    it('GIVEN setCurrentSection with empty string WHEN dispatched THEN should update to empty string', () => {
      // GIVEN
      const section = '';

      // WHEN
      store.dispatch(setCurrentSection(section));

      // THEN
      const newState = store.getState().ui;
      expect(newState.currentSection).toBe(section);
    });
  });

  describe('Search Actions', () => {
    it('GIVEN toggleSearch action WHEN dispatched with search closed THEN should open search', () => {
      // GIVEN
      const initialState = store.getState().ui;
      expect(initialState.isSearchOpen).toBe(false);

      // WHEN
      store.dispatch(toggleSearch());

      // THEN
      const newState = store.getState().ui;
      expect(newState.isSearchOpen).toBe(true);
    });

    it('GIVEN toggleSearch action WHEN dispatched with search open THEN should close search', () => {
      // GIVEN
      store.dispatch(setSearchOpen(true));
      const stateWithSearchOpen = store.getState().ui;
      expect(stateWithSearchOpen.isSearchOpen).toBe(true);

      // WHEN
      store.dispatch(toggleSearch());

      // THEN
      const newState = store.getState().ui;
      expect(newState.isSearchOpen).toBe(false);
    });

    it('GIVEN setSearchOpen action WHEN dispatched with true THEN should open search', () => {
      // GIVEN
      const isOpen = true;

      // WHEN
      store.dispatch(setSearchOpen(isOpen));

      // THEN
      const newState = store.getState().ui;
      expect(newState.isSearchOpen).toBe(true);
    });

    it('GIVEN setSearchOpen action WHEN dispatched with false THEN should close search', () => {
      // GIVEN
      store.dispatch(setSearchOpen(true));
      const isOpen = false;

      // WHEN
      store.dispatch(setSearchOpen(isOpen));

      // THEN
      const newState = store.getState().ui;
      expect(newState.isSearchOpen).toBe(false);
    });
  });

  describe('Modal Actions', () => {
    it('GIVEN setMovieModalOpen action WHEN dispatched with true THEN should open modal', () => {
      // GIVEN
      const isOpen = true;

      // WHEN
      store.dispatch(setMovieModalOpen(isOpen));

      // THEN
      const newState = store.getState().ui;
      expect(newState.isMovieModalOpen).toBe(true);
    });

    it('GIVEN setMovieModalOpen action WHEN dispatched with false THEN should close modal', () => {
      // GIVEN
      store.dispatch(setMovieModalOpen(true));
      const isOpen = false;

      // WHEN
      store.dispatch(setMovieModalOpen(isOpen));

      // THEN
      const newState = store.getState().ui;
      expect(newState.isMovieModalOpen).toBe(false);
    });

    it('GIVEN setSelectedMovie action WHEN dispatched with movie THEN should set selected movie', () => {
      // GIVEN
      const movie = mockMovie;

      // WHEN
      store.dispatch(setSelectedMovie(movie));

      // THEN
      const newState = store.getState().ui;
      expect(newState.selectedMovie).toEqual(movie);
    });

    it('GIVEN setSelectedMovie action WHEN dispatched with null THEN should clear selected movie', () => {
      // GIVEN
      store.dispatch(setSelectedMovie(mockMovie));
      const movie = null;

      // WHEN
      store.dispatch(setSelectedMovie(movie));

      // THEN
      const newState = store.getState().ui;
      expect(newState.selectedMovie).toBeNull();
    });
  });

  describe('Loading Actions', () => {
    it('GIVEN setGlobalLoading action WHEN dispatched with true THEN should set global loading', () => {
      // GIVEN
      const isLoading = true;

      // WHEN
      store.dispatch(setGlobalLoading(isLoading));

      // THEN
      const newState = store.getState().ui;
      expect(newState.isGlobalLoading).toBe(true);
    });

    it('GIVEN setGlobalLoading action WHEN dispatched with false THEN should clear global loading', () => {
      // GIVEN
      store.dispatch(setGlobalLoading(true));
      const isLoading = false;

      // WHEN
      store.dispatch(setGlobalLoading(isLoading));

      // THEN
      const newState = store.getState().ui;
      expect(newState.isGlobalLoading).toBe(false);
    });
  });

  describe('Notification Actions', () => {
    it('GIVEN addNotification action WHEN dispatched THEN should add notification to state', () => {
      // GIVEN
      const notification = mockNotification;

      // WHEN
      store.dispatch(addNotification(notification));

      // THEN
      const newState = store.getState().ui;
      expect(newState.notifications).toHaveLength(1);
      expect(newState.notifications[0]).toEqual(notification);
    });

    it('GIVEN addNotification action WHEN dispatched multiple times THEN should add multiple notifications', () => {
      // GIVEN
      const notification1 = { ...mockNotification, id: '1' };
      const notification2 = { ...mockNotification, id: '2' };

      // WHEN
      store.dispatch(addNotification(notification1));
      store.dispatch(addNotification(notification2));

      // THEN
      const newState = store.getState().ui;
      expect(newState.notifications).toHaveLength(2);
      expect(newState.notifications[0]).toEqual(notification1);
      expect(newState.notifications[1]).toEqual(notification2);
    });

    it('GIVEN removeNotification action WHEN dispatched THEN should remove notification by id', () => {
      // GIVEN
      const notification1 = { ...mockNotification, id: '1' };
      const notification2 = { ...mockNotification, id: '2' };
      store.dispatch(addNotification(notification1));
      store.dispatch(addNotification(notification2));

      // WHEN
      store.dispatch(removeNotification('1'));

      // THEN
      const newState = store.getState().ui;
      expect(newState.notifications).toHaveLength(1);
      expect(newState.notifications[0]).toEqual(notification2);
    });

    it('GIVEN removeNotification action WHEN dispatched with non-existent id THEN should not change notifications', () => {
      // GIVEN
      const notification = mockNotification;
      store.dispatch(addNotification(notification));

      // WHEN
      store.dispatch(removeNotification('non-existent'));

      // THEN
      const newState = store.getState().ui;
      expect(newState.notifications).toHaveLength(1);
      expect(newState.notifications[0]).toEqual(notification);
    });

    it('GIVEN clearNotifications action WHEN dispatched THEN should clear all notifications', () => {
      // GIVEN
      const notification1 = { ...mockNotification, id: '1' };
      const notification2 = { ...mockNotification, id: '2' };
      store.dispatch(addNotification(notification1));
      store.dispatch(addNotification(notification2));

      // WHEN
      store.dispatch(clearNotifications());

      // THEN
      const newState = store.getState().ui;
      expect(newState.notifications).toHaveLength(0);
    });
  });

  describe('Reset Action', () => {
    it('GIVEN resetUIState action WHEN dispatched THEN should reset to initial state', () => {
      // GIVEN
      store.dispatch(setCurrentSection('movies'));
      store.dispatch(setSearchOpen(true));
      store.dispatch(setMovieModalOpen(true));
      store.dispatch(setSelectedMovie(mockMovie));
      store.dispatch(setGlobalLoading(true));
      store.dispatch(addNotification(mockNotification));

      // WHEN
      store.dispatch(resetUIState());

      // THEN
      const newState = store.getState().ui;
      expect(newState.currentSection).toBe('home');
      expect(newState.isSearchOpen).toBe(false);
      expect(newState.isMovieModalOpen).toBe(false);
      expect(newState.selectedMovie).toBeNull();
      expect(newState.isGlobalLoading).toBe(false);
      expect(newState.notifications).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN addNotification action WHEN dispatched with notification without id THEN should generate id', () => {
      // GIVEN
      const notificationWithoutId = {
        type: 'success' as const,
        message: 'Test notification',
        timestamp: Date.now(),
        duration: 5000,
      };

      // WHEN
      store.dispatch(addNotification(notificationWithoutId));

      // THEN
      const newState = store.getState().ui;
      expect(newState.notifications).toHaveLength(1);
      expect(newState.notifications[0].id).toBeDefined();
      expect(newState.notifications[0].type).toBe('success');
      expect(newState.notifications[0].message).toBe('Test notification');
    });

    it('GIVEN addNotification action WHEN dispatched with notification without timestamp THEN should generate timestamp', () => {
      // GIVEN
      const notificationWithoutTimestamp = {
        id: 'test-id',
        type: 'success' as const,
        message: 'Test notification',
        duration: 5000,
      };

      // WHEN
      store.dispatch(addNotification(notificationWithoutTimestamp));

      // THEN
      const newState = store.getState().ui;
      expect(newState.notifications).toHaveLength(1);
      expect(newState.notifications[0].timestamp).toBeDefined();
      expect(typeof newState.notifications[0].timestamp).toBe('number');
    });
  });
});
