import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { HomePage } from './HomePage';
import { 
  FullTestWrapper
} from '../../__mocks__/testMocks';
import { 
  mockMovie,
  mockHeroMovie
} from '../../__mocks__/testData';
import { 
  resetAllMocks,
  mockSuccessfulApiResponse,
  mockApiError,
  mockEmptyApiResponse,
  mockOMDbServiceInstance
} from '../../__mocks__/testUtils';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock OMDbService
vi.mock('../../services/OMDbService', () => ({
  OMDbService: vi.fn().mockImplementation(() => mockOMDbServiceInstance),
}));

// Mock queryUtils to return our mock service
vi.mock('../../utils/queryUtils', () => ({
  withQueryErrorHandling: vi.fn((queryFn) => {
    return queryFn(mockOMDbServiceInstance);
  }),
  QUERY_CONFIG: {
    STALE_TIME: { HOMEPAGE: 0, SEARCH: 0, MOVIE_DETAILS: 0, MOVIES: 0 },
    GC_TIME: { HOMEPAGE: 0, SEARCH: 0, MOVIE_DETAILS: 0, MOVIES: 0 },
  },
}));

// Mock the api.config module to avoid import.meta issues
vi.mock('../../config/api.config', () => ({
  getApiConfig: vi.fn(() => ({
    omdb: {
      apiKey: 'test-key',
      baseURL: 'https://test.com',
      timeout: 10000,
    },
  })),
  isApiConfigValid: vi.fn(() => true),
}));

// Mock data transformers - use common mocks
vi.mock('../../utils/dataTransformers', () => ({
  createHomePageData: vi.fn((heroMovie, sections) => ({
    heroMovie: heroMovie || null,
    sections: sections || [],
  })),
  transformMoviesToSections: vi.fn((popular, topRated, upcoming) => {
    const sections = [];
    if (popular && popular.length > 0) sections.push({ title: 'Big Hits', movies: [mockMovie], type: 'big_hits' });
    if (topRated && topRated.length > 0) sections.push({ title: 'Top Rated', movies: [mockMovie], type: 'top_rated' });
    if (upcoming && upcoming.length > 0) sections.push({ title: 'Recently Released', movies: [mockMovie], type: 'recently_released' });
    return sections;
  }),
  transformOMDbSearchResultToMovie: vi.fn(() => mockMovie),
  transformOMDbMovieToMovie: vi.fn(() => mockMovie),
}));

// Note: Integration test uses its own mock setup above

describe('HomePage Integration', () => {

  beforeEach(() => {
    resetAllMocks();
    mockSuccessfulApiResponse();
  });

  describe('Data Loading', () => {
    it('GIVEN successful data fetch WHEN HomePage loads THEN should display real data', async () => {
      // GIVEN
      // Mocks are set in beforeEach

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      await waitFor(() => {
        expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Movie');
        expect(screen.getByText('Test tagline')).toBeInTheDocument();
        expect(screen.getByText('Big Hits')).toBeInTheDocument();
      });
    });

    it('GIVEN loading state WHEN HomePage loads THEN should display loading indicator', () => {
      // GIVEN
      // Override with loading mock
      mockOMDbServiceInstance.getPopularMovies.mockImplementation(() => new Promise(() => {})); // Never resolves
      mockOMDbServiceInstance.getTopRatedMovies.mockResolvedValue({ results: [] });
      mockOMDbServiceInstance.getUpcomingMovies.mockResolvedValue({ results: [] });
      mockOMDbServiceInstance.getMovieDetails.mockResolvedValue(mockHeroMovie);
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({ Search: [], totalResults: '0', Response: 'False' });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      expect(screen.getByTestId('homepage-loading')).toBeInTheDocument();
    });

    it('GIVEN error during data fetch WHEN HomePage loads THEN should display error message', async () => {
      // GIVEN
      mockApiError('Failed to fetch data');

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      await waitFor(() => {
        expect(screen.getByText('Error: Failed to fetch data')).toBeInTheDocument();
      });
    });

    it('GIVEN empty data WHEN HomePage loads THEN should display empty state', async () => {
      // GIVEN
      mockEmptyApiResponse();

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      await waitFor(() => {
        // Empty state is working correctly - component shows empty state
        expect(screen.getByTestId('homepage-empty')).toBeInTheDocument();
        expect(screen.getByText('No movie data available.')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      mockSuccessfulApiResponse();
    });

    it('GIVEN hero movie data WHEN clicking play button THEN should navigate to movie details', async () => {
      // GIVEN
      mockNavigate.mockClear();

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Movie');
      });

      fireEvent.click(screen.getByLabelText('Play'));

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
    });

    it('GIVEN hero movie data WHEN clicking more info button THEN should navigate to movie details', async () => {
      // GIVEN
      mockNavigate.mockClear();

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Movie');
      });

      fireEvent.click(screen.getByLabelText('More Info'));

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
    });

    it('GIVEN movie cards WHEN clicking a movie card THEN should navigate to movie details', async () => {
      // GIVEN
      mockNavigate.mockClear();

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Movie');
      });

      const movieCards = screen.getAllByTestId('movie-card');
      fireEvent.click(movieCards[0]);

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
    });

    it('GIVEN navigation WHEN clicking navigation item THEN should have correct href attribute', async () => {
      // GIVEN
      mockNavigate.mockClear();

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      await waitFor(() => {
        expect(screen.getByText('Movies')).toBeInTheDocument();
      });

      const moviesLink = screen.getByText('Movies');

      // THEN
      expect(moviesLink).toBeInTheDocument();
      expect(moviesLink).toHaveAttribute('href', '/movies');
    });

    it('GIVEN search functionality WHEN submitting search query THEN should not navigate (handled by HomePage)', async () => {
      // GIVEN
      mockNavigate.mockClear();

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      await waitFor(() => {
        expect(screen.getByLabelText('Search')).toBeInTheDocument();
      });

      // Click the search button to open the search bar
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      expect(searchToggleButton).toBeInTheDocument();
      fireEvent.click(searchToggleButton!);

      // Type in the search input
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });

      // Click the search button in the SearchBar
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      // THEN
      // Search function no longer navigates - it's handled by the HomePage component
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('GIVEN network error WHEN fetching data THEN should display network error message', async () => {
      // GIVEN
      mockApiError('Network Error');

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      await waitFor(() => {
        expect(screen.getByText('Error: Network Error')).toBeInTheDocument();
      });
    });

    it('GIVEN API timeout WHEN fetching data THEN should display timeout error message', async () => {
      // GIVEN
      mockApiError('Request timeout');

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      await waitFor(() => {
        expect(screen.getByText('Error: Request timeout')).toBeInTheDocument();
      });
    });

    it('GIVEN unknown error WHEN fetching data THEN should display generic error message', async () => {
      // GIVEN
      mockApiError('Unknown error occurred');

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // THEN
      await waitFor(() => {
        const errorElement = screen.getByTestId('homepage-error');
        expect(errorElement).toHaveTextContent('Error: Unknown error occurred');
      });
    });
  });
});