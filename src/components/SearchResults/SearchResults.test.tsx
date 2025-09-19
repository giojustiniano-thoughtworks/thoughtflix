import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SearchResults } from './SearchResults';
import { type Movie, type MovieFilters, type SearchResultsProps } from '../../types/movie.types';

// Common mocks
const mockOnMovieClick = vi.fn();
const mockOnBackToHome = vi.fn();
const mockOnRetry = vi.fn();

// Mock data
const mockMovies: Movie[] = [
  {
      id: '1',
      title: 'Test Movie 1',
      overview: 'Test overview 1',
      poster_path: '/test1.jpg',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 100,
      genre_ids: [28, 12],
      original_language: 'en',
      adult: false,
      video: false,
      original_title: ''
  },
  {
      id: '2',
      title: 'Test Movie 2',
      overview: 'Test overview 2',
      poster_path: '/test2.jpg',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2023-02-01',
      vote_average: 7.5,
      vote_count: 800,
      popularity: 80,
      genre_ids: [16, 35],
      original_language: 'es',
      adult: false,
      video: false,
      original_title: ''
  },
  {
      id: '3',
      title: 'Test Movie 3',
      overview: 'Test overview 3',
      poster_path: '/test3.jpg',
      backdrop_path: '/backdrop3.jpg',
      release_date: '2023-03-01',
      vote_average: 9.0,
      vote_count: 1200,
      popularity: 120,
      genre_ids: [28, 18],
      original_language: 'fr',
      adult: false,
      video: false,
      original_title: ''
  },
];

const mockFilters: MovieFilters = {
  selectedGenres: [28],
  selectedLanguages: ['en'],
  selectedReleaseYears: [2023],
  sortBy: 'popularity',
  sortOrder: 'desc',
};

// Test wrapper component
const TestWrapper: React.FC<{ 
  props?: Partial<SearchResultsProps>;
}> = ({ props = {} }) => {
  return (
    <SearchResults
      searchQuery="test query"
      movies={mockMovies}
      onMovieClick={mockOnMovieClick}
      onBackToHome={mockOnBackToHome}
      {...props}
    />
  );
};

describe('SearchResults Component - Optimized', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('GIVEN SearchResults component WHEN rendering with movies THEN should display search results', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByText('Search results for "test query"')).toBeInTheDocument();
      expect(screen.getByText('← Back to Home')).toBeInTheDocument();
      expect(screen.getAllByTestId('movie-card')).toHaveLength(3);
    });

    it('GIVEN SearchResults component WHEN rendering with empty movies array THEN should display no results message', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: [],
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByText('No movies found. Try a different search term.')).toBeInTheDocument();
    });

    it('GIVEN SearchResults component WHEN rendering with loading state THEN should display loading indicator', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: [],
        loading: true,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByTestId('search-results-loading')).toBeInTheDocument();
      expect(screen.getByText('Searching for movies...')).toBeInTheDocument();
    });

    it('GIVEN SearchResults component WHEN rendering with error state THEN should display error message', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: [],
        error: 'Search failed',
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByText('Error: Search failed')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  describe('Event Handler Optimization', () => {
    it('GIVEN SearchResults component WHEN re-rendering with same props THEN should maintain referential stability', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={props} />);
      
      // Get initial references
      const initialBackButton = screen.getByText('← Back to Home');
      const initialMovieCards = screen.getAllByTestId('movie-card');
      
      // Rerender with same props
      rerender(<TestWrapper props={props} />);
      
      // THEN
      // Event handlers should maintain referential stability due to useCallback
      expect(screen.getByText('← Back to Home')).toBe(initialBackButton);
      expect(screen.getAllByTestId('movie-card')).toEqual(initialMovieCards);
    });

    it('GIVEN SearchResults component WHEN props change THEN should update handlers appropriately', () => {
      // GIVEN
      const initialProps: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={initialProps} />);
      
      // THEN - Initially shows movies
      expect(screen.getAllByTestId('movie-card')).toHaveLength(3);

      // WHEN - Props change to empty movies
      const updatedProps: SearchResultsProps = {
        ...initialProps,
        movies: [],
      };
      rerender(<TestWrapper props={updatedProps} />);

      // THEN - Should show no results message
      expect(screen.getByText('No movies found. Try a different search term.')).toBeInTheDocument();
    });
  });

  describe('Movie Interactions', () => {
    it('GIVEN SearchResults component WHEN clicking on movie card THEN should call onMovieClick with movie data', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const movieCards = screen.getAllByTestId('movie-card');
      fireEvent.click(movieCards[0]);

      // THEN
      expect(mockOnMovieClick).toHaveBeenCalledWith(mockMovies[0]);
    });

    it('GIVEN SearchResults component WHEN clicking on different movie cards THEN should call onMovieClick with respective movie data', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const movieCards = screen.getAllByTestId('movie-card');
      
      movieCards.forEach((card, index) => {
        fireEvent.click(card);
        expect(mockOnMovieClick).toHaveBeenCalledWith(mockMovies[index]);
      });

      // THEN
      expect(mockOnMovieClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Navigation Interactions', () => {
    it('GIVEN SearchResults component WHEN clicking back to home button THEN should call onBackToHome', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.click(screen.getByText('← Back to Home'));

      // THEN
      expect(mockOnBackToHome).toHaveBeenCalled();
    });

    it('GIVEN SearchResults component WHEN pressing Escape key THEN should call onBackToHome', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.keyDown(document, { key: 'Escape' });

      // THEN
      expect(mockOnBackToHome).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('GIVEN SearchResults component WHEN clicking retry button THEN should call onRetry', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: [],
        error: 'Search failed',
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.click(screen.getByText('Try Again'));

      // THEN
      expect(mockOnRetry).toHaveBeenCalled();
    });

    it('GIVEN SearchResults component WHEN error occurs without retry handler THEN should not display retry button', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: [],
        error: 'Search failed',
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        // No onRetry handler
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });
  });

  describe('Filtering Functionality', () => {
    it('GIVEN SearchResults component WHEN filters are applied THEN should display filtered movies', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        filters: mockFilters,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      // Should show filtered results (only movies matching the filters)
      expect(screen.getAllByTestId('movie-card')).toHaveLength(1); // Only movie 1 matches filters
    });

    it('GIVEN SearchResults component WHEN filters result in no matches THEN should display no matches message', () => {
      // GIVEN
      const strictFilters: MovieFilters = {
        selectedGenres: [999], // Non-existent genre
        selectedLanguages: ['xx'], // Non-existent language
        selectedReleaseYears: [1900], // Non-existent year
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        filters: strictFilters,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByText('No movies match your current filters. Try adjusting your filter criteria.')).toBeInTheDocument();
    });

    it('GIVEN SearchResults component WHEN no filters are provided THEN should display all movies', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        // No filters
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getAllByTestId('movie-card')).toHaveLength(3);
    });
  });

  describe('Loading States', () => {
    it('GIVEN SearchResults component WHEN loading is true THEN should display loading indicator and hide movies', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        loading: true,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByTestId('search-results-loading')).toBeInTheDocument();
      expect(screen.queryByTestId('movie-card')).not.toBeInTheDocument();
    });

    it('GIVEN SearchResults component WHEN loading is false and no error THEN should display movies', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        loading: false,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.queryByTestId('search-results-loading')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('movie-card')).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('GIVEN SearchResults component WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Search results');
      expect(screen.getByText('← Back to Home')).toHaveAttribute('aria-label', 'Back to Home');
    });

    it('GIVEN SearchResults component WHEN rendered THEN should have proper heading structure', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Search results for "test query"');
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN SearchResults component WHEN search query is empty THEN should handle gracefully', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: '',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByText('Search results for ""')).toBeInTheDocument();
    });

    it('GIVEN SearchResults component WHEN movies array is undefined THEN should handle gracefully', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN & THEN
      expect(() => {
        render(<TestWrapper props={props} />);
      }).not.toThrow();
    });

    it('GIVEN SearchResults component WHEN rapid clicking THEN should handle gracefully', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      
      const backButton = screen.getByText('← Back to Home');
      const movieCards = screen.getAllByTestId('movie-card');
      
      // Rapid clicking
      for (let i = 0; i < 5; i++) {
        fireEvent.click(backButton);
        fireEvent.click(movieCards[0]);
      }

      // THEN
      expect(mockOnBackToHome).toHaveBeenCalledTimes(5);
      expect(mockOnMovieClick).toHaveBeenCalledTimes(5);
    });
  });

  describe('Performance Optimization', () => {
    it('GIVEN SearchResults component WHEN re-rendering with same props THEN should not cause unnecessary re-renders', () => {
      // GIVEN
      const props: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies,
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={props} />);
      
      // Get initial DOM elements
      const initialBackButton = screen.getByText('← Back to Home');
      const initialMovieCards = screen.getAllByTestId('movie-card');
      
      // Rerender with same props
      rerender(<TestWrapper props={props} />);
      
      // THEN
      // Elements should be the same instances (referential equality)
      expect(screen.getByText('← Back to Home')).toBe(initialBackButton);
      expect(screen.getAllByTestId('movie-card')).toEqual(initialMovieCards);
    });

    it('GIVEN SearchResults component WHEN movies array changes THEN should update efficiently', () => {
      // GIVEN
      const initialProps: SearchResultsProps = {
        searchQuery: 'test query',
        movies: mockMovies.slice(0, 2),
        onMovieClick: mockOnMovieClick,
        onBackToHome: mockOnBackToHome,
        onRetry: mockOnRetry,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={initialProps} />);
      
      // THEN - Initially 2 movies
      expect(screen.getAllByTestId('movie-card')).toHaveLength(2);

      // WHEN - Movies array changes
      const updatedProps: SearchResultsProps = {
        ...initialProps,
        movies: mockMovies, // All 3 movies
      };
      rerender(<TestWrapper props={updatedProps} />);

      // THEN - Should show 3 movies
      expect(screen.getAllByTestId('movie-card')).toHaveLength(3);
    });
  });
});
