import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNavigation, NavigationContext } from './useNavigation';
import { type Movie, type HeroMovie } from '../../types/movie.types';

// Mock the context for testing
const mockNavigationContext = {
  onMovieClick: vi.fn(),
  onPlayClick: vi.fn(),
  onMoreInfoClick: vi.fn(),
  onNavigate: vi.fn(),
  onSearch: vi.fn(),
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(
    NavigationContext.Provider,
    { value: mockNavigationContext },
    children
  );
};

const TestWrapperWithoutContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement('div', null, children);
};

describe('useNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GIVEN useNavigation hook', () => {
    describe('WHEN used within NavigationContext', () => {
      it('THEN should return navigation context values', () => {
        const { result } = renderHook(() => useNavigation(), {
          wrapper: TestWrapper,
        });

        expect(result.current).toEqual(mockNavigationContext);
      });

      it('THEN should provide onMovieClick function', () => {
        const { result } = renderHook(() => useNavigation(), {
          wrapper: TestWrapper,
        });

        const mockMovie: Movie = {
          id: '1',
          title: 'Test Movie',
          overview: 'Test overview',
          poster_path: '/test.jpg',
          backdrop_path: '/test-backdrop.jpg',
          release_date: '2023-01-01',
          vote_average: 7.5,
          vote_count: 1000,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          original_title: 'Test Movie',
          popularity: 0,
          video: false,
        };

        act(() => {
          result.current.onMovieClick(mockMovie);
        });

        expect(mockNavigationContext.onMovieClick).toHaveBeenCalledWith(mockMovie);
      });

      it('THEN should provide onPlayClick function', () => {
        const { result } = renderHook(() => useNavigation(), {
          wrapper: TestWrapper,
        });

        const mockHeroMovie: HeroMovie = {
          id: '1',
          title: 'Test Movie',
          overview: 'Test overview',
          poster_path: '/test.jpg',
          backdrop_path: '/test-backdrop.jpg',
          release_date: '2023-01-01',
          vote_average: 7.5,
          vote_count: 1000,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          original_title: 'Test Movie',
          popularity: 0,
          video: false,
          tagline: 'Test tagline',
        };

        act(() => {
          result.current.onPlayClick(mockHeroMovie);
        });

        expect(mockNavigationContext.onPlayClick).toHaveBeenCalledWith(mockHeroMovie);
      });

      it('THEN should provide onMoreInfoClick function', () => {
        const { result } = renderHook(() => useNavigation(), {
          wrapper: TestWrapper,
        });

        const mockHeroMovie: HeroMovie = {
          id: '1',
          title: 'Test Movie',
          overview: 'Test overview',
          poster_path: '/test.jpg',
          backdrop_path: '/test-backdrop.jpg',
          release_date: '2023-01-01',
          vote_average: 7.5,
          vote_count: 1000,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          original_title: 'Test Movie',
          popularity: 0,
          video: false,
          tagline: 'Test tagline',
        };

        act(() => {
          result.current.onMoreInfoClick(mockHeroMovie);
        });

        expect(mockNavigationContext.onMoreInfoClick).toHaveBeenCalledWith(mockHeroMovie);
      });

      it('THEN should provide onNavigate function', () => {
        const { result } = renderHook(() => useNavigation(), {
          wrapper: TestWrapper,
        });

        act(() => {
          result.current.onNavigate('home');
        });

        expect(mockNavigationContext.onNavigate).toHaveBeenCalledWith('home');
      });

      it('THEN should provide onSearch function', () => {
        const { result } = renderHook(() => useNavigation(), {
          wrapper: TestWrapper,
        });

        act(() => {
          result.current.onSearch('test query');
        });

        expect(mockNavigationContext.onSearch).toHaveBeenCalledWith('test query');
      });
    });

    describe('WHEN used outside NavigationContext', () => {
      it('THEN should throw an error', () => {
        expect(() => {
          renderHook(() => useNavigation(), {
            wrapper: TestWrapperWithoutContext,
          });
        }).toThrow('useNavigation must be used within NavigationWrapper');
      });
    });
  });
});
