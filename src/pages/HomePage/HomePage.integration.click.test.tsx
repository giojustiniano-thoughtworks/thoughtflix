import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { HomePage } from './HomePage';
import { useMoviesQuery } from '../../hooks/useMoviesQuery/useMoviesQuery';
import { type HomePageData, type HeroMovie, type Movie } from '../../types/movie.types';
import { FullTestWrapper } from '../../__mocks__/testMocks';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useMoviesQuery hook
vi.mock('../../hooks/useMoviesQuery/useMoviesQuery', () => ({
  useMoviesQuery: {
    useHomePageQuery: vi.fn(),
    useMovieSearchQuery: vi.fn(),
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

// Mock the HeroSection component
vi.mock('../../components/HeroSection', () => ({
  HeroSection: ({ movie, onPlayClick, onMoreInfoClick }: { movie?: HeroMovie; onPlayClick?: (movie: HeroMovie) => void; onMoreInfoClick?: (movie: HeroMovie) => void }) => (
    <div data-testid="hero-section">
      <h1 data-testid="hero-title">{movie?.title}</h1>
      <p data-testid="hero-overview">{movie?.overview}</p>
      <button onClick={() => movie && onPlayClick?.(movie)} data-testid="hero-play-button">
        Play
      </button>
      <button onClick={() => movie && onMoreInfoClick?.(movie)} data-testid="hero-more-info-button">
        More Info
      </button>
    </div>
  ),
}));

// Mock the MovieSection component
vi.mock('../../components/MovieSection', () => ({
  MovieSection: ({ title, movies, onMovieClick }: { title: string; movies: Movie[]; onMovieClick?: (movie: Movie) => void }) => (
    <div data-testid={`movie-section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h2>{title}</h2>
      <div data-testid="movie-cards">
        {movies.map((movie: Movie) => (
          <div
            key={movie.id}
            data-testid={`movie-card-${movie.id}`}
            onClick={() => onMovieClick?.(movie)}
            role="button"
            tabIndex={0}
          >
            {movie.title}
          </div>
        ))}
      </div>
    </div>
  ),
}));

// Mock the SearchResults component
vi.mock('../../components/SearchResults', () => ({
  SearchResults: ({ searchQuery, movies, onMovieClick }: { searchQuery: string; movies: Movie[]; onMovieClick?: (movie: Movie) => void }) => (
    <div data-testid="search-results">
      <h2>Search Results for: {searchQuery}</h2>
      <div data-testid="search-movie-cards">
        {movies.map((movie: Movie) => (
          <div
            key={movie.id}
            data-testid={`search-movie-card-${movie.id}`}
            onClick={() => onMovieClick?.(movie)}
            role="button"
            tabIndex={0}
          >
            {movie.title}
          </div>
        ))}
      </div>
    </div>
  ),
}));

describe('HomePage Click Integration', () => {
  const mockHeroMovie: HeroMovie = {
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
    tagline: 'Speed meets destiny',
  };

  const mockMovies: Movie[] = [
    {
      id: 'tt1111111',
      title: 'Movie 1',
      overview: 'Overview 1',
      poster_path: '/movie1-poster.jpg',
      backdrop_path: '/movie1-backdrop.jpg',
      release_date: '2025-01-01',
      vote_average: 7.5,
      vote_count: 500,
      genre_ids: [1, 2],
      adult: false,
      original_language: 'en',
      original_title: 'Movie 1',
      popularity: 80,
      video: false,
    },
    {
      id: 'tt2222222',
      title: 'Movie 2',
      overview: 'Overview 2',
      poster_path: '/movie2-poster.jpg',
      backdrop_path: '/movie2-backdrop.jpg',
      release_date: '2025-02-01',
      vote_average: 8.0,
      vote_count: 750,
      genre_ids: [2, 3],
      adult: false,
      original_language: 'en',
      original_title: 'Movie 2',
      popularity: 90,
      video: false,
    },
  ];

  const mockHomePageData: HomePageData = {
    heroMovie: mockHeroMovie,
    sections: [
      {
        title: 'Big Hits',
        movies: mockMovies,
        type: 'big_hits',
      },
      {
        title: 'Recently Released',
        movies: mockMovies,
        type: 'recently_released',
      },
    ],
  };

  const mockUseHomePageQuery = vi.fn();
  const mockUseMovieSearchQuery = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMoviesQuery.useHomePageQuery as unknown as typeof mockUseHomePageQuery) = mockUseHomePageQuery;
    (useMoviesQuery.useMovieSearchQuery as unknown as typeof mockUseMovieSearchQuery) = mockUseMovieSearchQuery;
  });

  describe('Hero Section Click Functionality', () => {
    it('GIVEN a homepage with hero section WHEN play button is clicked THEN should call onPlayClick with hero movie', () => {
      // GIVEN
      mockUseHomePageQuery.mockReturnValue({
        data: mockHomePageData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      const playButton = screen.getByTestId('hero-play-button');
      fireEvent.click(playButton);

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
    });

    it('GIVEN a homepage with hero section WHEN more info button is clicked THEN should call onMoreInfoClick with hero movie', () => {
      // GIVEN
      mockUseHomePageQuery.mockReturnValue({
        data: mockHomePageData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      const moreInfoButton = screen.getByTestId('hero-more-info-button');
      fireEvent.click(moreInfoButton);

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
    });
  });

  describe('Movie Section Click Functionality', () => {
    it('GIVEN a homepage with movie sections WHEN movie card is clicked THEN should call onMovieClick with movie data', () => {
      // GIVEN
      mockUseHomePageQuery.mockReturnValue({
        data: mockHomePageData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      const movieCard = screen.getAllByTestId('movie-card-tt1111111')[0];
      fireEvent.click(movieCard);

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1111111');
    });

    it('GIVEN a homepage with multiple movie sections WHEN different movie cards are clicked THEN should call onMovieClick with correct movie data', () => {
      // GIVEN
      mockUseHomePageQuery.mockReturnValue({
        data: mockHomePageData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      const movieCard1 = screen.getAllByTestId('movie-card-tt1111111')[0];
      const movieCard2 = screen.getAllByTestId('movie-card-tt2222222')[0];
      
      fireEvent.click(movieCard1);
      fireEvent.click(movieCard2);

      // THEN
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/movie/tt1111111');
      expect(mockNavigate).toHaveBeenNthCalledWith(2, '/movie/tt2222222');
    });
  });

  describe('Search Results Click Functionality', () => {
    it('GIVEN a homepage with search results WHEN search movie card is clicked THEN should call onMovieClick with movie data', () => {
      // GIVEN
      const searchMovies = [mockMovies[0]];
      
      mockUseHomePageQuery.mockReturnValue({
        data: mockHomePageData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: searchMovies },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Simulate search by clicking search button
      const searchButton = screen.getByText('Search');
      fireEvent.click(searchButton);

      // Wait for search results to appear
      waitFor(() => {
        const searchMovieCard = screen.getByTestId('search-movie-card-tt1111111');
        fireEvent.click(searchMovieCard);
      });

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1111111');
    });
  });

  describe('Navigation Functionality', () => {

    it('GIVEN a homepage WHEN search is triggered THEN should not navigate (handled by HomePage)', () => {
      // GIVEN
      mockUseHomePageQuery.mockReturnValue({
        data: mockHomePageData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      const searchButton = screen.getByText('Search');
      fireEvent.click(searchButton);

      // THEN
      // Search function no longer navigates - it's handled by the HomePage component
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN a homepage without handlers WHEN buttons are clicked THEN should not throw errors', () => {
      // GIVEN
      mockUseHomePageQuery.mockReturnValue({
        data: mockHomePageData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      const playButton = screen.getByTestId('hero-play-button');
      const moreInfoButton = screen.getByTestId('hero-more-info-button');
      const movieCard = screen.getAllByTestId('movie-card-tt1111111')[0];

      // THEN
      expect(() => fireEvent.click(playButton)).not.toThrow();
      expect(() => fireEvent.click(moreInfoButton)).not.toThrow();
      expect(() => fireEvent.click(movieCard)).not.toThrow();
    });

    it('GIVEN a homepage with loading state WHEN buttons are clicked THEN should handle gracefully', () => {
      // GIVEN
      mockUseHomePageQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      expect(screen.getByTestId('homepage-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading homepage data...')).toBeInTheDocument();
    });

    it('GIVEN a homepage with error state WHEN buttons are clicked THEN should handle gracefully', () => {
      // GIVEN
      mockUseHomePageQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: 'Test error' },
        refetch: vi.fn(),
      });

      mockUseMovieSearchQuery.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      expect(screen.getByTestId('homepage-error')).toBeInTheDocument();
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
  });
});
