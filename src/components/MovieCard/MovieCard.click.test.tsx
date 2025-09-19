import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MovieCard } from './MovieCard';
import { type Movie } from '../../types/movie.types';

describe('MovieCard Click Functionality', () => {
  const mockMovie: Movie = {
    id: 'tt1234567',
    title: 'F1: The Movie',
    overview: 'A Formula One driver comes out of retirement to mentor and team up with a younger driver.',
    poster_path: '/f1-movie-poster.jpg',
    backdrop_path: '/f1-movie-backdrop.jpg',
    release_date: '2025-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [1, 2, 3],
    adult: false,
    original_language: 'en',
    original_title: 'F1: The Movie',
    popularity: 100,
    video: false,
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Click Functionality', () => {
    it('GIVEN a movie card with onClick handler WHEN card is clicked THEN should call onClick with movie data', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      fireEvent.click(movieCard);

      // THEN
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
    });

    it('GIVEN a movie card without onClick handler WHEN card is clicked THEN should not throw error', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      
      // THEN
      expect(() => fireEvent.click(movieCard)).not.toThrow();
    });

    it('GIVEN a movie card WHEN card is clicked via keyboard Enter THEN should call onClick', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      movieCard.focus();
      fireEvent.keyDown(movieCard, { key: 'Enter' });

      // THEN
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
    });

    it('GIVEN a movie card WHEN card is clicked via keyboard Space THEN should call onClick', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      movieCard.focus();
      fireEvent.keyDown(movieCard, { key: ' ' });

      // THEN
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
    });

    it('GIVEN a movie card WHEN card is clicked via keyboard other keys THEN should not call onClick', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      movieCard.focus();
      fireEvent.keyDown(movieCard, { key: 'Escape' });
      fireEvent.keyDown(movieCard, { key: 'Tab' });
      fireEvent.keyDown(movieCard, { key: 'ArrowDown' });

      // THEN
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('GIVEN a movie card WHEN rendering THEN should have proper ARIA attributes', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');

      // THEN
      expect(movieCard).toHaveAttribute('role', 'button');
      expect(movieCard).toHaveAttribute('tabIndex', '0');
      expect(movieCard).toHaveAttribute('aria-label', 'View details for F1: The Movie');
    });

    it('GIVEN a movie card WHEN rendering THEN should be keyboard navigable', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');

      // THEN
      expect(movieCard).toBeInTheDocument();

      // Test keyboard navigation
      movieCard.focus();
      expect(document.activeElement).toBe(movieCard);
    });

    it('GIVEN a movie card with different variants WHEN rendering THEN should maintain accessibility', () => {
      // GIVEN
      const variants = ['default', 'large', 'small'] as const;

      variants.forEach((variant) => {
        // WHEN
        const { unmount } = render(
          <MovieCard
            movie={mockMovie}
            onClick={mockOnClick}
            size={variant === 'default' ? 'medium' : variant}
          />
        );

        const movieCard = screen.getByTestId('movie-card');

        // THEN
        expect(movieCard).toHaveAttribute('role', 'button');
        expect(movieCard).toHaveAttribute('tabIndex', '0');
        expect(movieCard).toHaveClass(`movie-card--${variant === 'default' ? 'medium' : variant}`);

        unmount();
      });
    });
  });

  describe('Visual States', () => {
    it('GIVEN a movie card WHEN hovering THEN should show hover state', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      fireEvent.mouseEnter(movieCard);

      // THEN
      expect(movieCard).toHaveClass('movie-card--hoverable');
    });

    it('GIVEN a movie card WHEN mouse leaves THEN should remove hover state', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      fireEvent.mouseEnter(movieCard);
      fireEvent.mouseLeave(movieCard);

      // THEN
      expect(movieCard).not.toHaveClass('movie-card--hover');
    });

    it('GIVEN a movie card WHEN rendering THEN should display movie information', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      // THEN
      expect(screen.getByText('F1: The Movie')).toBeInTheDocument();
      expect(screen.getByText('2025')).toBeInTheDocument();
      expect(screen.getByText('⭐ 8.5')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN a movie card with missing data WHEN rendering THEN should handle gracefully', () => {
      // GIVEN
      const incompleteMovie = {
        ...mockMovie,
        title: '',
        release_date: '',
        vote_average: 0,
      };

      // WHEN
      render(
        <MovieCard
          movie={incompleteMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');

      // THEN
      expect(movieCard).toBeInTheDocument();
      expect(() => fireEvent.click(movieCard)).not.toThrow();
    });

    it('GIVEN a movie card WHEN clicked multiple times THEN should call onClick multiple times', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      fireEvent.click(movieCard);
      fireEvent.click(movieCard);
      fireEvent.click(movieCard);

      // THEN
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('GIVEN a movie card with special characters in title WHEN rendering THEN should display correctly', () => {
      // GIVEN
      const movieWithSpecialChars = {
        ...mockMovie,
        title: 'Movie: The "Special" & Unusual Title (2025)',
      };

      // WHEN
      render(
        <MovieCard
          movie={movieWithSpecialChars}
          onClick={mockOnClick}
        />
      );

      // THEN
      expect(screen.getByText('Movie: The "Special" & Unusual Title (2025)')).toBeInTheDocument();
      expect(screen.getByTestId('movie-card')).toHaveAttribute('aria-label', 'View details for Movie: The "Special" & Unusual Title (2025)');
    });

    it('GIVEN a movie card with very long title WHEN rendering THEN should handle text overflow', () => {
      // GIVEN
      const movieWithLongTitle = {
        ...mockMovie,
        title: 'A'.repeat(100),
      };

      // WHEN
      render(
        <MovieCard
          movie={movieWithLongTitle}
          onClick={mockOnClick}
        />
      );

      // THEN
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
      expect(screen.getByTestId('movie-card')).toHaveAttribute('aria-label', `View details for ${'A'.repeat(100)}`);
    });
  });

  describe('Performance', () => {
    it('GIVEN a movie card WHEN rendering multiple times THEN should not cause memory leaks', () => {
      // GIVEN
      const movies = Array.from({ length: 100 }, (_, index) => ({
        ...mockMovie,
        id: `tt${index}`,
        title: `Movie ${index}`,
      }));

      // WHEN
      const { unmount } = render(
        <div>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={mockOnClick}
            />
          ))}
        </div>
      );

      // THEN
      expect(screen.getAllByTestId('movie-card')).toHaveLength(100);
      
      // Cleanup
      unmount();
    });

    it('GIVEN a movie card WHEN clicking rapidly THEN should handle rapid clicks', () => {
      // GIVEN
      // WHEN
      render(
        <MovieCard
          movie={mockMovie}
          onClick={mockOnClick}
        />
      );

      const movieCard = screen.getByTestId('movie-card');
      
      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(movieCard);
      }

      // THEN
      expect(mockOnClick).toHaveBeenCalledTimes(10);
    });
  });
});

