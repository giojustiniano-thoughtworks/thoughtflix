import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { MovieSection } from './MovieSection';
import { type Movie } from '../../types/movie.types';

describe('MovieSection', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      overview: 'A thief who steals corporate secrets through dream-sharing technology.',
      poster_path: '/poster1.jpg',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2010-07-16',
      vote_average: 8.8,
      vote_count: 25000,
      genre_ids: [28, 878, 53],
      adult: false,
      original_language: 'en',
      original_title: 'Inception',
      popularity: 85.5,
      video: false,
    },
    {
      id: 2,
      title: 'The Dark Knight',
      overview: 'When the menace known as the Joker wreaks havoc on Gotham.',
      poster_path: '/poster2.jpg',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2008-07-18',
      vote_average: 9.0,
      vote_count: 30000,
      genre_ids: [28, 80, 18],
      adult: false,
      original_language: 'en',
      original_title: 'The Dark Knight',
      popularity: 90.2,
      video: false,
    },
  ];

  describe('Rendering', () => {
    it('GIVEN a movie section WHEN rendering MovieSection THEN should display section title', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByText('Big Hits')).toBeInTheDocument();
    });

    it('GIVEN a movie section WHEN rendering MovieSection THEN should display all movies', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
    });

    it('GIVEN a movie section WHEN rendering MovieSection THEN should have correct section class', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByTestId('movie-section')).toHaveClass('movie-section');
    });

    it('GIVEN a movie section with big_hits type WHEN rendering MovieSection THEN should have big hits styling', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByTestId('movie-section')).toHaveClass('movie-section--big-hits');
    });

    it('GIVEN a movie section with recently_released type WHEN rendering MovieSection THEN should have recently released styling', () => {
      // GIVEN
      const title = 'Recently Released';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="recently_released" />);

      // THEN
      expect(screen.getByTestId('movie-section')).toHaveClass('movie-section--recently-released');
    });

    it('GIVEN a movie section with top_rated type WHEN rendering MovieSection THEN should have top rated styling', () => {
      // GIVEN
      const title = 'Top Rated';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="top_rated" />);

      // THEN
      expect(screen.getByTestId('movie-section')).toHaveClass('movie-section--top-rated');
    });

    it('GIVEN a movie section with trending type WHEN rendering MovieSection THEN should have trending styling', () => {
      // GIVEN
      const title = 'Trending Now';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="trending" />);

      // THEN
      expect(screen.getByTestId('movie-section')).toHaveClass('movie-section--trending');
    });
  });

  describe('User Interactions', () => {
    it('GIVEN a movie section with onMovieClick handler WHEN clicking a movie THEN should call handler with movie', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;
      const onMovieClick = vi.fn();

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" onMovieClick={onMovieClick} />);
      fireEvent.click(screen.getByText('Inception'));

      // THEN
      expect(onMovieClick).toHaveBeenCalledWith(movies[0]);
    });

    it('GIVEN a movie section without onMovieClick handler WHEN clicking a movie THEN should not throw error', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;

      // WHEN & THEN
      expect(() => {
        render(<MovieSection title={title} movies={movies} type="big_hits" />);
        fireEvent.click(screen.getByText('Inception'));
      }).not.toThrow();
    });

    it('GIVEN a movie section WHEN scrolling horizontally THEN should show scroll indicators', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);
      const scrollContainer = screen.getByTestId('movie-scroll-container');

      // THEN
      expect(scrollContainer).toHaveClass('movie-scroll-container');
    });
  });

  describe('Empty States', () => {
    it('GIVEN an empty movie list WHEN rendering MovieSection THEN should display empty message', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies: Movie[] = [];

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByText('No movies available')).toBeInTheDocument();
    });

    it('GIVEN a movie section with empty movies WHEN rendering MovieSection THEN should have empty state styling', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies: Movie[] = [];

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByTestId('movie-section')).toHaveClass('movie-section--empty');
    });
  });

  describe('Loading States', () => {
    it('GIVEN a movie section with loading state WHEN rendering MovieSection THEN should display loading indicators', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies: Movie[] = [];

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByTestId('movie-section')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN a movie section with single movie WHEN rendering MovieSection THEN should display correctly', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = [mockMovies[0]];

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.queryByText('The Dark Knight')).not.toBeInTheDocument();
    });

    it('GIVEN a movie section with many movies WHEN rendering MovieSection THEN should display all movies', () => {
      // GIVEN
      const title = 'Big Hits';
      const manyMovies = Array.from({ length: 20 }, (_, i) => ({
        ...mockMovies[0],
        id: i + 1,
        title: `Movie ${i + 1}`,
      }));

      // WHEN
      render(<MovieSection title={title} movies={manyMovies} type="big_hits" />);

      // THEN
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Movie 20')).toBeInTheDocument();
    });

    it('GIVEN a movie section with very long title WHEN rendering MovieSection THEN should handle gracefully', () => {
      // GIVEN
      const longTitle = 'A'.repeat(100);
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={longTitle} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('GIVEN a movie section with movies containing special characters WHEN rendering MovieSection THEN should handle gracefully', () => {
      // GIVEN
      const title = 'Big Hits';
      const specialMovies = [
        {
          ...mockMovies[0],
          title: 'Movie: The "Special" & Unusual (2023)',
        },
      ];

      // WHEN
      render(<MovieSection title={title} movies={specialMovies} type="big_hits" />);

      // THEN
      expect(screen.getByText('Movie: The "Special" & Unusual (2023)')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('GIVEN a movie section WHEN rendering MovieSection THEN should have proper ARIA labels', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Big Hits movies');
    });

    it('GIVEN a movie section WHEN rendering MovieSection THEN should have proper heading structure', () => {
      // GIVEN
      const title = 'Big Hits';
      const movies = mockMovies;

      // WHEN
      render(<MovieSection title={title} movies={movies} type="big_hits" />);

      // THEN
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Big Hits');
    });
  });
});
