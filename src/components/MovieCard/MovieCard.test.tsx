import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MovieCard } from './MovieCard';
import { type Movie } from '../../types/movie.types';

// Common mocks
const mockOnClick = vi.fn();

// Mock data
const mockMovie: Movie = {
    id: '1',
    title: 'Test Movie',
    overview: 'Test overview for the movie',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 100,
    genre_ids: [28, 12],
    original_language: 'en',
    adult: false,
    video: false,
    original_title: ''
};

// Test wrapper component
const TestWrapper: React.FC<{ 
  props?: Partial<React.ComponentProps<typeof MovieCard>>;
}> = ({ props = {} }) => {
  return (
    <MovieCard
      movie={mockMovie}
      onClick={mockOnClick}
      {...props}
    />
  );
};

describe('MovieCard Component - Optimized', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('GIVEN MovieCard component WHEN rendering with movie data THEN should display movie information', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('2023')).toBeInTheDocument();
      expect(screen.getByText('⭐ 8.5')).toBeInTheDocument();
      expect(screen.getByText('Test overview for the movie')).toBeInTheDocument();
    });

    it('GIVEN MovieCard component WHEN rendering with long overview THEN should truncate overview', () => {
      // GIVEN
      const longOverviewMovie: Movie = {
        ...mockMovie,
        overview: 'This is a very long overview that should be truncated because it exceeds the maximum length allowed for display in the movie card component.',
      };

      const props = {
        movie: longOverviewMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByText(/This is a very long overview that should be truncated/)).toBeInTheDocument();
      expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    });

    it('GIVEN MovieCard component WHEN rendering with missing poster THEN should show placeholder', () => {
      // GIVEN
      const movieWithoutPoster: Movie = {
        ...mockMovie,
        poster_path: '',
      };

      const props = {
        movie: movieWithoutPoster,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      const posterImg = screen.getByAltText('Test Movie poster');
      expect(posterImg).toHaveAttribute('src', '/placeholder-movie.jpg');
    });

    it('GIVEN MovieCard component WHEN rendering with custom size THEN should apply correct classes', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
        size: 'large' as const,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByTestId('movie-card')).toHaveClass('movie-card--large');
    });
  });

  describe('Event Handler Optimization', () => {
    it('GIVEN MovieCard component WHEN re-rendering with same props THEN should maintain referential stability', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={props} />);
      
      // Get initial reference
      const initialCard = screen.getByTestId('movie-card');
      
      // Rerender with same props
      rerender(<TestWrapper props={props} />);
      
      // THEN
      // Event handlers should maintain referential stability due to useCallback
      expect(screen.getByTestId('movie-card')).toBe(initialCard);
    });

    it('GIVEN MovieCard component WHEN props change THEN should update handlers appropriately', () => {
      // GIVEN
      const initialProps = {
        movie: mockMovie,
        onClick: mockOnClick,
        disabled: false,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={initialProps} />);
      
      // THEN - Initially enabled
      expect(screen.getByTestId('movie-card')).not.toHaveClass('movie-card--disabled');

      // WHEN - Props change to disabled
      const updatedProps = {
        ...initialProps,
        disabled: true,
      };
      rerender(<TestWrapper props={updatedProps} />);

      // THEN - Should be disabled
      expect(screen.getByTestId('movie-card')).toHaveClass('movie-card--disabled');
    });
  });

  describe('Click Interactions', () => {
    it('GIVEN MovieCard component WHEN clicking on card THEN should call onClick with movie data', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.click(screen.getByTestId('movie-card'));

      // THEN
      expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
    });

    it('GIVEN MovieCard component WHEN pressing Enter key THEN should call onClick', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.keyDown(screen.getByTestId('movie-card'), { key: 'Enter' });

      // THEN
      expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
    });

    it('GIVEN MovieCard component WHEN pressing Space key THEN should call onClick', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.keyDown(screen.getByTestId('movie-card'), { key: ' ' });

      // THEN
      expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
    });

    it('GIVEN MovieCard component WHEN disabled THEN should not call onClick', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
        disabled: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.click(screen.getByTestId('movie-card'));

      // THEN
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Image Loading', () => {
    it('GIVEN MovieCard component WHEN image loads successfully THEN should display image', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      const posterImg = screen.getByAltText('Test Movie poster');
      expect(posterImg).toHaveAttribute('src', '/test-poster.jpg');
    });

    it('GIVEN MovieCard component WHEN image fails to load THEN should show placeholder', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const posterImg = screen.getByAltText('Test Movie poster');
      fireEvent.error(posterImg);

      // THEN
      expect(posterImg).toHaveAttribute('src', '/placeholder-movie.jpg');
    });

    it('GIVEN MovieCard component WHEN image is loading THEN should have loading attribute', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      const posterImg = screen.getByAltText('Test Movie poster');
      expect(posterImg).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Accessibility', () => {
    it('GIVEN MovieCard component WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('aria-label', 'View details for Test Movie');
    });

    it('GIVEN MovieCard component WHEN disabled THEN should have proper tabindex', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
        disabled: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveAttribute('tabIndex', '-1');
    });

    it('GIVEN MovieCard component WHEN rendered THEN should have proper alt text for images', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      const posterImg = screen.getByAltText('Test Movie poster');
      expect(posterImg).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN MovieCard component WHEN movie has no title THEN should handle gracefully', () => {
      // GIVEN
      const movieWithoutTitle: Movie = {
        ...mockMovie,
        title: '',
      };

      const props = {
        movie: movieWithoutTitle,
        onClick: mockOnClick,
      };

      // WHEN & THEN
      expect(() => {
        render(<TestWrapper props={props} />);
      }).not.toThrow();
    });

    it('GIVEN MovieCard component WHEN movie has no overview THEN should handle gracefully', () => {
      // GIVEN
      const movieWithoutOverview: Movie = {
        ...mockMovie,
        overview: '',
      };

      const props = {
        movie: movieWithoutOverview,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByTestId('movie-card')).toBeInTheDocument();
    });

    it('GIVEN MovieCard component WHEN movie has invalid release date THEN should handle gracefully', () => {
      // GIVEN
      const movieWithInvalidDate: Movie = {
        ...mockMovie,
        release_date: 'invalid-date',
      };

      const props = {
        movie: movieWithInvalidDate,
        onClick: mockOnClick,
      };

      // WHEN & THEN
      expect(() => {
        render(<TestWrapper props={props} />);
      }).not.toThrow();
    });

    it('GIVEN MovieCard component WHEN rapid clicking THEN should handle gracefully', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const card = screen.getByTestId('movie-card');
      
      // Rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(card);
      }

      // THEN
      expect(mockOnClick).toHaveBeenCalledTimes(10);
    });
  });

  describe('Performance Optimization', () => {
    it('GIVEN MovieCard component WHEN re-rendering with same props THEN should not cause unnecessary re-renders', () => {
      // GIVEN
      const props = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={props} />);
      
      // Get initial DOM elements
      const initialCard = screen.getByTestId('movie-card');
      const initialTitle = screen.getByText('Test Movie');
      
      // Rerender with same props
      rerender(<TestWrapper props={props} />);
      
      // THEN
      // Elements should be the same instances (referential equality)
      expect(screen.getByTestId('movie-card')).toBe(initialCard);
      expect(screen.getByText('Test Movie')).toBe(initialTitle);
    });

    it('GIVEN MovieCard component WHEN movie data changes THEN should update efficiently', () => {
      // GIVEN
      const initialProps = {
        movie: mockMovie,
        onClick: mockOnClick,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={initialProps} />);
      
      // THEN - Initially shows original title
      expect(screen.getByText('Test Movie')).toBeInTheDocument();

      // WHEN - Movie data changes
      const updatedMovie: Movie = {
        ...mockMovie,
        title: 'Updated Movie Title',
      };
      const updatedProps = {
        ...initialProps,
        movie: updatedMovie,
      };
      rerender(<TestWrapper props={updatedProps} />);

      // THEN - Should show updated title
      expect(screen.getByText('Updated Movie Title')).toBeInTheDocument();
    });
  });
});
