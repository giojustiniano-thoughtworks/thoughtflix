import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  setCurrentSection,
  toggleSearch,
  setSearchOpen,
  setMovieModalOpen,
  setSelectedMovie,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} from '../../store/slices/uiSlice';
import {
  setHeroMovie,
  setSections,
  setSearchResults,
  setSearchQuery,
  setLoading,
  setError,
  clearErrors,
  setPagination,
  resetMoviesState,
  fetchHomePageData,
  searchMovies,
} from '../../store/slices/moviesSlice';
import { type Movie, type HeroMovie, type MovieSection } from '../../types/movie.types';
import { type MovieSearchParams, type MovieFetchParams } from '../../types/redux.types';

/**
 * Custom hook for UI actions
 */
export const useUIActions = () => {
  const dispatch = useAppDispatch();

  return {
    setCurrentSection: useCallback((section: string) => {
      dispatch(setCurrentSection(section));
    }, [dispatch]),

    toggleSearch: useCallback(() => {
      dispatch(toggleSearch());
    }, [dispatch]),

    setSearchOpen: useCallback((isOpen: boolean) => {
      dispatch(setSearchOpen(isOpen));
    }, [dispatch]),

    setMovieModalOpen: useCallback((isOpen: boolean) => {
      dispatch(setMovieModalOpen(isOpen));
    }, [dispatch]),

    setSelectedMovie: useCallback((movie: Movie | null) => {
      dispatch(setSelectedMovie(movie));
    }, [dispatch]),

    setGlobalLoading: useCallback((isLoading: boolean) => {
      dispatch(setGlobalLoading(isLoading));
    }, [dispatch]),

    addNotification: useCallback((notification: Omit<Parameters<typeof addNotification>[0], 'id' | 'timestamp'> & { id?: string; timestamp?: number }) => {
      dispatch(addNotification(notification));
    }, [dispatch]),

    removeNotification: useCallback((id: string) => {
      dispatch(removeNotification(id));
    }, [dispatch]),

    clearNotifications: useCallback(() => {
      dispatch(clearNotifications());
    }, [dispatch]),
  };
};

/**
 * Custom hook for movie actions
 */
export const useMovieActions = () => {
  const dispatch = useAppDispatch();

  return {
    setHeroMovie: useCallback((movie: HeroMovie | null) => {
      dispatch(setHeroMovie(movie));
    }, [dispatch]),

    setSections: useCallback((sections: MovieSection[]) => {
      dispatch(setSections(sections));
    }, [dispatch]),

    setSearchResults: useCallback((results: Movie[]) => {
      dispatch(setSearchResults(results));
    }, [dispatch]),

    setSearchQuery: useCallback((query: string) => {
      dispatch(setSearchQuery(query));
    }, [dispatch]),

    setLoading: useCallback((loading: { hero?: boolean; sections?: boolean; search?: boolean }) => {
      dispatch(setLoading(loading));
    }, [dispatch]),

    setError: useCallback((error: { hero?: string; sections?: string; search?: string }) => {
      dispatch(setError(error));
    }, [dispatch]),

    clearErrors: useCallback(() => {
      dispatch(clearErrors());
    }, [dispatch]),

    setPagination: useCallback((pagination: { currentPage: number; totalPages: number }) => {
      dispatch(setPagination(pagination));
    }, [dispatch]),

    resetMoviesState: useCallback(() => {
      dispatch(resetMoviesState());
    }, [dispatch]),

    fetchHomePageData: useCallback((params?: MovieFetchParams) => {
      return dispatch(fetchHomePageData(params || {}));
    }, [dispatch]),

    searchMovies: useCallback((params: MovieSearchParams) => {
      return dispatch(searchMovies(params));
    }, [dispatch]),
  };
};

/**
 * Custom hook for UI selectors
 */
export const useUISelectors = () => {
  return {
    currentSection: useAppSelector((state) => state.ui.currentSection),
    isSearchOpen: useAppSelector((state) => state.ui.isSearchOpen),
    isMovieModalOpen: useAppSelector((state) => state.ui.isMovieModalOpen),
    selectedMovie: useAppSelector((state) => state.ui.selectedMovie),
    isGlobalLoading: useAppSelector((state) => state.ui.isGlobalLoading),
    notifications: useAppSelector((state) => state.ui.notifications),
  };
};

/**
 * Custom hook for movie selectors
 */
export const useMovieSelectors = () => {
  return {
    heroMovie: useAppSelector((state) => state.movies.heroMovie),
    sections: useAppSelector((state) => state.movies.sections),
    searchResults: useAppSelector((state) => state.movies.searchResults),
    searchQuery: useAppSelector((state) => state.movies.searchQuery),
    isLoadingHero: useAppSelector((state) => state.movies.isLoadingHero),
    isLoadingSections: useAppSelector((state) => state.movies.isLoadingSections),
    isLoadingSearch: useAppSelector((state) => state.movies.isLoadingSearch),
    heroError: useAppSelector((state) => state.movies.heroError),
    sectionsError: useAppSelector((state) => state.movies.sectionsError),
    searchError: useAppSelector((state) => state.movies.searchError),
    currentPage: useAppSelector((state) => state.movies.currentPage),
    totalPages: useAppSelector((state) => state.movies.totalPages),
  };
};

/**
 * Custom hook for combined movie and UI selectors
 */
export const useAppSelectors = () => {
  return {
    ...useUISelectors(),
    ...useMovieSelectors(),
  };
};

/**
 * Custom hook for combined movie and UI actions
 */
export const useAppActions = () => {
  return {
    ...useUIActions(),
    ...useMovieActions(),
  };
};
