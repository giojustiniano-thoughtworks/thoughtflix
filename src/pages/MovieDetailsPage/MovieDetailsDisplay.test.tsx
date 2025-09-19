import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MovieDetailsDisplay } from './MovieDetailsDisplay';
import { type MovieDetails } from '../../types/movie.types';

describe('MovieDetailsDisplay', () => {
  const mockMovieDetails: MovieDetails = {
    id: 'tt1234567',
    title: 'Test Movie',
    overview: 'Test movie overview with a long description that should be displayed properly.',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [1, 2, 3],
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie',
    popularity: 100,
    video: false,
    budget: 100000000,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 3, name: 'Drama' },
    ],
    homepage: 'https://testmovie.com',
    imdb_id: 'tt1234567',
    production_companies: [
      { id: 1, logo_path: '/logo1.png', name: 'Test Studio', origin_country: 'US' },
    ],
    production_countries: [
      { iso_3166_1: 'US', name: 'United States' },
    ],
    revenue: 500000000,
    runtime: 120,
    spoken_languages: [
      { english_name: 'English', iso_639_1: 'en', name: 'English' },
    ],
    status: 'Released',
    tagline: 'Test tagline',
  };

  const mockOnBack = vi.fn();
  const mockOnPlayClick = vi.fn();
  const mockOnMoreInfoClick = vi.fn();
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('GIVEN a movie details display component WHEN rendering with movie data THEN should display movie information', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          onBack={mockOnBack}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      // THEN
      expect(screen.getByTestId('movie-details-display')).toBeInTheDocument();
      expect(screen.getByTestId('movie-title')).toHaveTextContent('Test Movie');
      expect(screen.getByTestId('movie-overview')).toHaveTextContent('Test movie overview with a long description that should be displayed properly.');
      expect(screen.getByTestId('movie-release-date')).toHaveTextContent('January 1, 2023');
      expect(screen.getByTestId('movie-rating')).toHaveTextContent('8.5/10');
      expect(screen.getByTestId('movie-runtime')).toHaveTextContent('2h 0m');
      expect(screen.getByTestId('movie-status')).toHaveTextContent('Released');
      expect(screen.getByTestId('movie-tagline')).toHaveTextContent('Test tagline');
    });

    it('GIVEN a movie details display component WHEN rendering with loading state THEN should display loading indicator', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          loading={true}
          onBack={mockOnBack}
        />
      );

      // THEN
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading movie details...')).toBeInTheDocument();
    });

    it('GIVEN a movie details display component WHEN rendering with error state THEN should display error message', () => {
      // GIVEN
      const errorMessage = 'Failed to load movie details';
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          error={errorMessage}
          onBack={mockOnBack}
          onRetry={mockOnRetry}
        />
      );

      // THEN
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    it('GIVEN a movie details display component WHEN rendering without movie data THEN should display empty state', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={null}
          onBack={mockOnBack}
        />
      );

      // THEN
      expect(screen.getByTestId('movie-details-display')).toBeInTheDocument();
      expect(screen.queryByTestId('movie-title')).not.toBeInTheDocument();
    });
  });

  describe('Genres Display', () => {
    const genreTestCases = [
      {
        description: 'movie with multiple genres',
        movie: {
          ...mockMovieDetails,
          genres: [
            { id: 1, name: 'Action' },
            { id: 2, name: 'Adventure' },
            { id: 3, name: 'Drama' },
          ],
        },
        expectedGenres: ['Action', 'Adventure', 'Drama'],
      },
      {
        description: 'movie with single genre',
        movie: {
          ...mockMovieDetails,
          genres: [{ id: 1, name: 'Comedy' }],
        },
        expectedGenres: ['Comedy'],
      },
      {
        description: 'movie with no genres',
        movie: {
          ...mockMovieDetails,
          genres: [],
        },
        expectedGenres: [],
      },
      {
        description: 'movie with many genres',
        movie: {
          ...mockMovieDetails,
          genres: [
            { id: 1, name: 'Action' },
            { id: 2, name: 'Adventure' },
            { id: 3, name: 'Drama' },
            { id: 4, name: 'Comedy' },
            { id: 5, name: 'Thriller' },
          ],
        },
        expectedGenres: ['Action', 'Adventure', 'Drama', 'Comedy', 'Thriller'],
      },
    ];

    genreTestCases.forEach(({ description, movie, expectedGenres }) => {
      it(`GIVEN a movie details display component WHEN rendering ${description} THEN should display correct genres`, () => {
        // GIVEN
        // WHEN
        render(
          <MovieDetailsDisplay
            movie={movie}
            onBack={mockOnBack}
          />
        );

        // THEN
        expectedGenres.forEach((genre, index) => {
          expect(screen.getByTestId(`genre-${movie.genres[index]?.id}`)).toHaveTextContent(genre);
        });
      });
    });
  });

  describe('Rating Display', () => {
    const ratingTestCases = [
      {
        description: 'movie with high rating',
        movie: { ...mockMovieDetails, vote_average: 9.2 },
        expectedRating: '9.2',
      },
      {
        description: 'movie with low rating',
        movie: { ...mockMovieDetails, vote_average: 3.1 },
        expectedRating: '3.1',
      },
      {
        description: 'movie with zero rating',
        movie: { ...mockMovieDetails, vote_average: 0 },
        expectedRating: '0',
      },
      {
        description: 'movie with decimal rating',
        movie: { ...mockMovieDetails, vote_average: 7.8 },
        expectedRating: '7.8',
      },
    ];

    ratingTestCases.forEach(({ description, movie, expectedRating }) => {
      it(`GIVEN a movie details display component WHEN rendering ${description} THEN should display correct rating`, () => {
        // GIVEN
        // WHEN
        render(
          <MovieDetailsDisplay
            movie={movie}
            onBack={mockOnBack}
          />
        );

        // THEN
        expect(screen.getByTestId('movie-rating')).toHaveTextContent(expectedRating);
      });
    });
  });

  describe('Release Date Display', () => {
    const dateTestCases = [
      {
        description: 'movie with valid release date',
        movie: { ...mockMovieDetails, release_date: '2023-12-25' },
        expectedDate: 'December 25, 2023',
      },
      {
        description: 'movie with invalid release date',
        movie: { ...mockMovieDetails, release_date: 'Invalid Date' },
        expectedDate: 'Invalid Date',
      },
      {
        description: 'movie with empty release date',
        movie: { ...mockMovieDetails, release_date: '' },
        expectedDate: 'N/A',
      },
    ];

    dateTestCases.forEach(({ description, movie, expectedDate }) => {
      it(`GIVEN a movie details display component WHEN rendering ${description} THEN should display correct release date`, () => {
        // GIVEN
        // WHEN
        render(
          <MovieDetailsDisplay
            movie={movie}
            onBack={mockOnBack}
          />
        );

        // THEN
        expect(screen.getByTestId('movie-release-date')).toHaveTextContent(expectedDate);
      });
    });
  });

  describe('User Interactions', () => {
    it('GIVEN a movie details display component WHEN back button is clicked THEN should call onBack', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          onBack={mockOnBack}
        />
      );

      fireEvent.click(screen.getByText('Back'));

      // THEN
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('GIVEN a movie details display component WHEN play button is clicked THEN should call onPlayClick with movie data', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          onPlayClick={mockOnPlayClick}
        />
      );

      fireEvent.click(screen.getByText('Play'));

      // THEN
      expect(mockOnPlayClick).toHaveBeenCalledWith(mockMovieDetails);
    });

    it('GIVEN a movie details display component WHEN more info button is clicked THEN should call onMoreInfoClick with movie data', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      fireEvent.click(screen.getByText('More Info'));

      // THEN
      expect(mockOnMoreInfoClick).toHaveBeenCalledWith(mockMovieDetails);
    });

    it('GIVEN a movie details display component WHEN retry button is clicked THEN should call onRetry', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          error="Test error"
          onRetry={mockOnRetry}
        />
      );

      fireEvent.click(screen.getByText('Retry'));

      // THEN
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    const errorTestCases = [
      {
        description: 'network error',
        error: 'Network error',
        expectedMessage: 'Network error',
      },
      {
        description: 'server error',
        error: 'Server error',
        expectedMessage: 'Server error',
      },
      {
        description: 'not found error',
        error: 'Movie not found',
        expectedMessage: 'Movie not found',
      },
      {
        description: 'unknown error',
        error: 'Unknown error',
        expectedMessage: 'Unknown error',
      },
    ];

    errorTestCases.forEach(({ description, error, expectedMessage }) => {
      it(`GIVEN a movie details display component WHEN ${description} occurs THEN should display correct error message`, () => {
        // GIVEN
        // WHEN
        render(
          <MovieDetailsDisplay
            movie={mockMovieDetails}
            error={error}
            onRetry={mockOnRetry}
          />
        );

        // THEN
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.getByText(`Error: ${expectedMessage}`)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN a movie details display component WHEN movie has missing optional data THEN should display available data', () => {
      // GIVEN
      const incompleteMovie = {
        ...mockMovieDetails,
        overview: '',
        genres: [],
        vote_average: 0,
        runtime: 0,
        tagline: '',
        status: '',
      };

      // WHEN
      render(
        <MovieDetailsDisplay
          movie={incompleteMovie}
          onBack={mockOnBack}
        />
      );

      // THEN
      expect(screen.getByTestId('movie-title')).toHaveTextContent('Test Movie');
      expect(screen.getByTestId('movie-overview')).toHaveTextContent('No overview available.');
      expect(screen.getByTestId('movie-rating')).toHaveTextContent('N/A/10');
      expect(screen.getByTestId('movie-runtime')).toHaveTextContent('N/A');
    });

    it('GIVEN a movie details display component WHEN movie has very long overview THEN should display full overview', () => {
      // GIVEN
      const longOverview = 'A'.repeat(1000);
      const movieWithLongOverview = {
        ...mockMovieDetails,
        overview: longOverview,
      };

      // WHEN
      render(
        <MovieDetailsDisplay
          movie={movieWithLongOverview}
          onBack={mockOnBack}
        />
      );

      // THEN
      expect(screen.getByTestId('movie-overview')).toHaveTextContent(longOverview);
    });

    it('GIVEN a movie details display component WHEN movie has special characters in title THEN should display correctly', () => {
      // GIVEN
      const movieWithSpecialChars = {
        ...mockMovieDetails,
        title: 'Movie: The "Special" & Unusual Title (2023)',
      };

      // WHEN
      render(
        <MovieDetailsDisplay
          movie={movieWithSpecialChars}
          onBack={mockOnBack}
        />
      );

      // THEN
      expect(screen.getByTestId('movie-title')).toHaveTextContent('Movie: The "Special" & Unusual Title (2023)');
    });
  });

  describe('Accessibility', () => {
    it('GIVEN a movie details display component WHEN rendering THEN should have proper ARIA labels', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          onBack={mockOnBack}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      // THEN
      expect(screen.getByTestId('movie-details-display')).toBeInTheDocument();
      expect(screen.getByTestId('movie-title')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go back to previous page' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Play Test Movie' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'More information about Test Movie' })).toBeInTheDocument();
    });

    it('GIVEN a movie details display component WHEN rendering THEN should be keyboard navigable', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          onBack={mockOnBack}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      // THEN
      const backButton = screen.getByText('Back');
      const playButton = screen.getByText('Play');
      const moreInfoButton = screen.getByText('More Info');

      expect(backButton).toBeInTheDocument();
      expect(playButton).toBeInTheDocument();
      expect(moreInfoButton).toBeInTheDocument();

      // Test keyboard navigation
      backButton.focus();
      expect(document.activeElement).toBe(backButton);
    });

    it('GIVEN a movie details display component WHEN rendering with loading state THEN should have proper loading accessibility', () => {
      // GIVEN
      // WHEN
      render(
        <MovieDetailsDisplay
          movie={mockMovieDetails}
          loading={true}
          onBack={mockOnBack}
        />
      );

      // THEN
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading movie details...')).toBeInTheDocument();
    });
  });
});
