import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { HomePage } from './HomePage';
import { 
  setupCommonMocks,
  mockSuccessfulApiResponse,
  resetAllMocks,
  mockOMDbServiceInstance
} from '../../__mocks__/testUtils';
import { FullTestWrapper } from '../../__mocks__/testMocks';
import { mockMovie } from '../../__mocks__/testData';

// Setup common mocks
setupCommonMocks();

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

// Mock data transformers
vi.mock('../../utils/dataTransformers', () => ({
  createHomePageData: vi.fn((heroMovie, sections) => ({
    heroMovie: heroMovie || null,
    sections,
  })),
  transformMoviesToSections: vi.fn((popular, topRated, upcoming) => {
    const sections = [];
    if (popular && popular.length > 0) sections.push({ title: 'Big Hits', movies: popular, type: 'big_hits' });
    if (topRated && topRated.length > 0) sections.push({ title: 'Top Rated', movies: topRated, type: 'top_rated' });
    if (upcoming && upcoming.length > 0) sections.push({ title: 'Recently Released', movies: upcoming, type: 'recently_released' });
    return sections;
  }),
  transformOMDbSearchResultToMovie: vi.fn((searchResult) => ({
    ...mockMovie,
    id: searchResult.imdbID,
    title: searchResult.Title,
    release_date: searchResult.Year ? `${searchResult.Year}-01-01` : 'N/A',
  })),
  transformOMDbMovieToMovie: vi.fn(() => mockMovie),
}));

describe('HomePage Search Functionality', () => {
  beforeEach(() => {
    resetAllMocks();
    mockSuccessfulApiResponse();
  });

  describe('Search State Management', () => {
    it('GIVEN HomePage WHEN user searches for movies THEN should show search results', async () => {
      // GIVEN
      const searchQuery = 'The Matrix';
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: [{ Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'N/A' }],
        totalResults: '1',
        Response: 'True',
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Open search bar
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      expect(searchToggleButton).toBeInTheDocument();
      fireEvent.click(searchToggleButton!);

      // Type search query
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });

      // Click search button
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      // THEN
      await waitFor(() => {
        expect(screen.getByText(`Search results for "${searchQuery}"`)).toBeInTheDocument();
        expect(screen.getByText('The Matrix')).toBeInTheDocument();
      });
    });

    it('GIVEN search results WHEN user clicks back to home THEN should return to homepage', async () => {
      // GIVEN
      const searchQuery = 'The Matrix';
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: [{ Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'N/A' }],
        totalResults: '1',
        Response: 'True',
      });

      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Perform search
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(`Search results for "${searchQuery}"`)).toBeInTheDocument();
      });

      // WHEN
      const backButton = screen.getByText('← Back to Home');
      fireEvent.click(backButton);

      // THEN
      await waitFor(() => {
        expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Movie');
        expect(screen.getByText('Big Hits')).toBeInTheDocument();
        expect(screen.queryByText(`Search results for "${searchQuery}"`)).not.toBeInTheDocument();
      });
    });

    it('GIVEN search results WHEN user presses Escape key THEN should return to homepage', async () => {
      // GIVEN
      const searchQuery = 'The Matrix';
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: [{ Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'N/A' }],
        totalResults: '1',
        Response: 'True',
      });

      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Perform search
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(`Search results for "${searchQuery}"`)).toBeInTheDocument();
      });

      // WHEN
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      // THEN
      await waitFor(() => {
        expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Movie');
        expect(screen.queryByText(`Search results for "${searchQuery}"`)).not.toBeInTheDocument();
      });
    });
  });

  describe('Search Results Display', () => {
    it('GIVEN successful search WHEN results are loaded THEN should display movie cards', async () => {
      // GIVEN
      const searchQuery = 'Action';
      const searchResults = [
        { Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'N/A' },
        { Title: 'John Wick', Year: '2014', imdbID: 'tt2911666', Type: 'movie', Poster: 'N/A' },
      ];
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: searchResults,
        totalResults: '2',
        Response: 'True',
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Perform search
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      // THEN
      await waitFor(() => {
        expect(screen.getByText('The Matrix')).toBeInTheDocument();
        expect(screen.getByText('John Wick')).toBeInTheDocument();
        expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
      });
    });

    it('GIVEN empty search results WHEN search completes THEN should display no results message', async () => {
      // GIVEN
      const searchQuery = 'NonExistentMovie';
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: [],
        totalResults: '0',
        Response: 'False',
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Perform search
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      // THEN
      await waitFor(() => {
        expect(screen.getByText('No movies found. Try a different search term.')).toBeInTheDocument();
      });
    });

    it('GIVEN search error WHEN search fails THEN should display error message', async () => {
      // GIVEN
      const searchQuery = 'The Matrix';
      mockOMDbServiceInstance.searchMovies.mockRejectedValue(new Error('Search failed'));

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Perform search
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      // THEN
      await waitFor(() => {
        expect(screen.getByText('Error: Search failed')).toBeInTheDocument();
      });
    });
  });

  describe('Search Loading States', () => {
    it('GIVEN search in progress WHEN loading THEN should display loading indicator', async () => {
      // GIVEN
      const searchQuery = 'The Matrix';
      mockOMDbServiceInstance.searchMovies.mockImplementation(() => new Promise(() => {})); // Never resolves

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Perform search
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      // THEN
      await waitFor(() => {
        expect(screen.getByTestId('search-results-loading')).toBeInTheDocument();
        expect(screen.getByText('Searching for movies...')).toBeInTheDocument();
      });
    });
  });

  describe('Search Query Validation', () => {
    it.each([
      ['', false],
      ['   ', false],
      ['a', true],
      ['The Matrix', true],
      ['Action Movies 2023', true],
    ])('GIVEN search query "%s" WHEN validating THEN should be valid: %s', async (query, expectedValid) => {
      // GIVEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // WHEN
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: query } });
      const searchButton = screen.getByTestId('search-button');

      // THEN
      if (expectedValid) {
        expect(searchButton).not.toBeDisabled();
      } else {
        expect(searchButton).toBeDisabled();
      }
    });
  });

  describe('Search Results Interaction', () => {
    it('GIVEN search results WHEN clicking on movie THEN should navigate to movie details', async () => {
      // GIVEN
      mockNavigate.mockClear();
      const searchQuery = 'The Matrix';
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: [{ Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'N/A' }],
        totalResults: '1',
        Response: 'True',
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Perform search
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('The Matrix')).toBeInTheDocument();
      });

      // Click on movie
      const movieCard = screen.getByTestId('movie-card');
      fireEvent.click(movieCard);

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt0133093');
    });
  });

  describe('Search State Persistence', () => {
    it('GIVEN search results WHEN navigating away and back THEN should maintain search state', async () => {
      // GIVEN
      const searchQuery = 'The Matrix';
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: [{ Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'N/A' }],
        totalResults: '1',
        Response: 'True',
      });

      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      // Perform search
      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: searchQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(`Search results for "${searchQuery}"`)).toBeInTheDocument();
      });

      // WHEN - Navigate away (simulate by clicking back to home)
      const backButton = screen.getByText('← Back to Home');
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Movie');
      });

      // THEN - Should return to homepage
      await waitFor(() => {
        expect(screen.queryByText(`Search results for "${searchQuery}"`)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN very long search query WHEN searching THEN should handle long query', async () => {
      // GIVEN
      const longQuery = 'a'.repeat(1000);
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: [],
        totalResults: '0',
        Response: 'False',
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: longQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      // THEN
      await waitFor(() => {
        expect(screen.getByText(`Search results for "${longQuery}"`)).toBeInTheDocument();
      });
    });

    it('GIVEN special characters in search query WHEN searching THEN should handle special characters', async () => {
      // GIVEN
      const specialQuery = 'Movie: "The Matrix" (1999) - Action/Sci-Fi';
      mockOMDbServiceInstance.searchMovies.mockResolvedValue({
        Search: [],
        totalResults: '0',
        Response: 'False',
      });

      // WHEN
      render(<HomePage />, { wrapper: FullTestWrapper });

      // Wait for homepage to load
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument();
      });

      const searchToggleButton = screen.getByTestId('navigation').querySelector('.navigation__search-button');
      fireEvent.click(searchToggleButton!);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: specialQuery } });
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);

      // THEN
      await waitFor(() => {
        expect(screen.getByText(`Search results for "${specialQuery}"`)).toBeInTheDocument();
      });
    });
  });
});
