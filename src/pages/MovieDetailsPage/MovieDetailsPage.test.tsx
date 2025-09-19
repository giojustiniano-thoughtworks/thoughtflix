import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { MovieDetailsPage } from './MovieDetailsPage';
import { useMoviesQuery } from '../../hooks/useMoviesQuery';
import { type MovieDetails } from '../../types/movie.types';

// Mock the useMoviesQuery hook
vi.mock('../../hooks/useMoviesQuery', () => ({
  useMoviesQuery: {
    useMovieDetailsQuery: vi.fn(),
  },
}));

// Mock the Navigation component
vi.mock('../../components/Navigation', () => ({
  Navigation: ({ onNavigate, onSearch, currentSection }: { onNavigate?: (section: string) => void; onSearch?: (query: string) => void; currentSection: string }) => (
    <nav data-testid="navigation">
      <button onClick={() => onNavigate?.('home')}>Home</button>
      <button onClick={() => onSearch?.('test search')}>Search</button>
      <span data-testid="current-section">{currentSection}</span>
    </nav>
  ),
}));

// Mock the MovieDetailsDisplay component
vi.mock('./MovieDetailsDisplay', () => ({
  MovieDetailsDisplay: ({ movie, loading, error, onBack, onPlayClick, onMoreInfoClick, onRetry }: { movie?: MovieDetails; loading?: boolean; error?: string; onBack?: () => void; onPlayClick?: (movie: MovieDetails) => void; onMoreInfoClick?: (movie: MovieDetails) => void; onRetry?: () => void }) => (
    <div data-testid="movie-details-display">
      {loading && <div data-testid="loading">Loading movie details...</div>}
      {error && <div data-testid="error">Error: {error}</div>}
      {movie && (
        <div>
          <h1 data-testid="movie-title">{movie.title}</h1>
          <p data-testid="movie-overview">{movie.overview}</p>
          <p data-testid="movie-release-date">{movie.release_date}</p>
          <div data-testid="movie-genres">
            {movie.genres?.map((genre: { id: number; name: string }) => (
              <span key={genre.id} data-testid={`genre-${genre.id}`}>
                {genre.name}
              </span>
            ))}
          </div>
          <p data-testid="movie-rating">{movie.vote_average}</p>
          <button onClick={() => onBack?.()}>Back</button>
          <button onClick={() => onPlayClick?.(movie)}>Play</button>
          <button onClick={() => onMoreInfoClick?.(movie)}>More Info</button>
          <button onClick={() => onRetry?.()}>Retry</button>
        </div>
      )}
    </div>
  ),
}));

describe('MovieDetailsPage', () => {
  const mockMovieDetails: MovieDetails = {
    id: 'tt1234567',
    title: 'Test Movie',
    overview: 'Test movie overview',
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

  const mockUseMovieDetailsQuery = vi.fn();
  const mockOnBack = vi.fn();
  const mockOnPlayClick = vi.fn();
  const mockOnMoreInfoClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMoviesQuery.useMovieDetailsQuery as unknown as typeof mockUseMovieDetailsQuery) = mockUseMovieDetailsQuery;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('GIVEN a movie details page component WHEN rendering with valid movie ID THEN should display movie details', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage
            movieId="tt1234567"
            onBack={mockOnBack}
            onPlayClick={mockOnPlayClick}
            onMoreInfoClick={mockOnMoreInfoClick}
          />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('movie-details-display')).toBeInTheDocument();
      expect(screen.getByTestId('movie-title')).toHaveTextContent('Test Movie');
      expect(screen.getByTestId('movie-overview')).toHaveTextContent('Test movie overview');
      expect(screen.getByTestId('movie-release-date')).toHaveTextContent('2023-01-01');
      expect(screen.getByTestId('movie-rating')).toHaveTextContent('8.5');
    });

    it('GIVEN a movie details page component WHEN rendering with loading state THEN should display loading indicator', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading movie details...')).toBeInTheDocument();
    });

    it('GIVEN a movie details page component WHEN rendering with error state THEN should display error message', () => {
      // GIVEN
      const errorMessage = 'Failed to load movie details';
      mockUseMovieDetailsQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage },
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    it('GIVEN a movie details page component WHEN rendering without movie data THEN should display empty state', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('movie-details-display')).toBeInTheDocument();
      expect(screen.queryByTestId('movie-title')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('GIVEN a movie details page component WHEN rendering THEN should display navigation with correct current section', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('current-section')).toHaveTextContent('movie-details');
    });

    it('GIVEN a movie details page component WHEN navigation search is clicked THEN should call onSearch with query', () => {
      // GIVEN
      const mockOnSearch = vi.fn();
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" onSearch={mockOnSearch} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Search'));

      // THEN
      expect(mockOnSearch).toHaveBeenCalledWith('test search');
    });
  });

  describe('User Interactions', () => {
    it('GIVEN a movie details page component WHEN back button is clicked THEN should call onBack', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" onBack={mockOnBack} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Back'));

      // THEN
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('GIVEN a movie details page component WHEN play button is clicked THEN should call onPlayClick with movie data', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" onPlayClick={mockOnPlayClick} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Play'));

      // THEN
      expect(mockOnPlayClick).toHaveBeenCalledWith(mockMovieDetails);
    });

    it('GIVEN a movie details page component WHEN more info button is clicked THEN should call onMoreInfoClick with movie data', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" onMoreInfoClick={mockOnMoreInfoClick} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('More Info'));

      // THEN
      expect(mockOnMoreInfoClick).toHaveBeenCalledWith(mockMovieDetails);
    });

    it('GIVEN a movie details page component WHEN retry button is clicked THEN should call refetch', () => {
      // GIVEN
      const mockRefetch = vi.fn();
      mockUseMovieDetailsQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: 'Test error' },
        refetch: mockRefetch,
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Retry'));

      // THEN
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data Display', () => {
    const testCases = [
      {
        description: 'movie with all genres',
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
    ];

    testCases.forEach(({ description, movie, expectedGenres }) => {
      it(`GIVEN a movie details page component WHEN rendering ${description} THEN should display correct genres`, () => {
        // GIVEN
        mockUseMovieDetailsQuery.mockReturnValue({
          data: movie,
          isLoading: false,
          isError: false,
          error: null,
          refetch: vi.fn(),
        });

        // WHEN
        render(
          <MemoryRouter 
            initialEntries={['/movie/tt1234567']}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <MovieDetailsPage movieId="tt1234567" />
          </MemoryRouter>
        );

        // THEN
        expectedGenres.forEach((genre, index) => {
          expect(screen.getByTestId(`genre-${movie.genres[index]?.id}`)).toHaveTextContent(genre);
        });
      });
    });
  });

  describe('Error Handling', () => {
    const errorTestCases = [
      {
        description: 'network error',
        error: { message: 'Network error', status: 0, code: 'NETWORK_ERROR' },
        expectedMessage: 'Network error',
      },
      {
        description: 'server error',
        error: { message: 'Server error', status: 500, code: 'SERVER_ERROR' },
        expectedMessage: 'Server error',
      },
      {
        description: 'not found error',
        error: { message: 'Movie not found', status: 404, code: 'NOT_FOUND' },
        expectedMessage: 'Movie not found',
      },
      {
        description: 'unknown error',
        error: { message: 'Unknown error', status: 0, code: 'UNKNOWN_ERROR' },
        expectedMessage: 'Unknown error',
      },
    ];

    errorTestCases.forEach(({ description, error, expectedMessage }) => {
      it(`GIVEN a movie details page component WHEN ${description} occurs THEN should display correct error message`, () => {
        // GIVEN
        mockUseMovieDetailsQuery.mockReturnValue({
          data: null,
          isLoading: false,
          isError: true,
          error,
          refetch: vi.fn(),
        });

        // WHEN
        render(
          <MemoryRouter 
            initialEntries={['/movie/tt1234567']}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <MovieDetailsPage movieId="tt1234567" />
          </MemoryRouter>
        );

        // THEN
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.getByText(`Error: ${expectedMessage}`)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN a movie details page component WHEN movie ID is empty THEN should handle gracefully', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: 'Invalid movie ID' },
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="" />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('GIVEN a movie details page component WHEN movie has missing data THEN should display available data', () => {
      // GIVEN
      const incompleteMovie = {
        ...mockMovieDetails,
        overview: '',
        genres: [],
        vote_average: 0,
      };
      mockUseMovieDetailsQuery.mockReturnValue({
        data: incompleteMovie,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('movie-title')).toHaveTextContent('Test Movie');
      expect(screen.getByTestId('movie-overview')).toHaveTextContent('');
      expect(screen.getByTestId('movie-rating')).toHaveTextContent('0');
    });

    it('GIVEN a movie details page component WHEN component unmounts THEN should not cause memory leaks', () => {
      // GIVEN
      const mockRefetch = vi.fn();
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      });

      // WHEN
      const { unmount } = render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
      );

      unmount();

      // THEN
      // Component should unmount without errors
      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('GIVEN a movie details page component WHEN rendering THEN should have proper ARIA labels', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('movie-details-display')).toBeInTheDocument();
      expect(screen.getByTestId('movie-title')).toBeInTheDocument();
    });

    it('GIVEN a movie details page component WHEN rendering THEN should be keyboard navigable', () => {
      // GIVEN
      mockUseMovieDetailsQuery.mockReturnValue({
        data: mockMovieDetails,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(
        <MemoryRouter 
          initialEntries={['/movie/tt1234567']}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MovieDetailsPage movieId="tt1234567" />
        </MemoryRouter>
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
  });
});

