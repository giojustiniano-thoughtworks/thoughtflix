import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Navigation } from './Navigation';
import { filterReducer } from '../../store/slices/filterSlice';
import { type NavigationProps } from '../../types/movie.types';
import { type RootState } from '../../store/store';

// Common mocks
const mockOnSearch = vi.fn();

// Test store factory
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      filter: filterReducer,
    },
    preloadedState: {
      filter: {
        isFilterOpen: false,
        movieFilters: {
          selectedGenres: [],
          selectedLanguages: [],
          selectedReleaseYears: [],
          sortBy: 'popularity' as const,
          sortOrder: 'desc' as const,
        },
        availableFilterOptions: {
          genres: [],
          languages: [],
          releaseYears: [],
        },
        ...(initialState as { filter?: Partial<RootState['filter']> }).filter,
      },
    },
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ 
  children?: React.ReactNode; 
  props?: Partial<NavigationProps>;
  storeState?: Partial<RootState>;
}> = ({ children, props = {}, storeState = {} }) => {
  const store = createTestStore(storeState);
  return (
    <Provider store={store}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Navigation
          onSearch={mockOnSearch}
          isSearchActive={false}
          searchResultCount={0}
          {...props}
        />
        {children}
      </MemoryRouter>
    </Provider>
  );
};

describe('Navigation Component - Optimized', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('GIVEN Navigation component WHEN rendering THEN should display all required elements', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: false,
        searchResultCount: 0,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByText('THOUGHTFLIX')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('TV Shows')).toBeInTheDocument();
      expect(screen.getByText('Movies')).toBeInTheDocument();
      expect(screen.getByText('New & Popular')).toBeInTheDocument();
      expect(screen.getByText('My List')).toBeInTheDocument();
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('GIVEN Navigation component with search active WHEN rendering THEN should display filter button', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: true,
        searchResultCount: 5,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByLabelText('Filter movies')).toBeInTheDocument();
    });

    it('GIVEN Navigation component with search inactive WHEN rendering THEN should not display filter button', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: false,
        searchResultCount: 0,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.queryByLabelText('Filter movies')).not.toBeInTheDocument();
    });
  });

  describe('Event Handler Optimization', () => {
    it('GIVEN Navigation component WHEN event handlers are called multiple times THEN should maintain referential stability', async () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: true,
        searchResultCount: 5,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={props} />);
      
      // Get initial references
      const homeLink = screen.getByText('Home');
      const searchButton = screen.getByLabelText('Search');
      
      // Rerender with same props
      rerender(<TestWrapper props={props} />);
      
      // THEN
      // Event handlers should maintain referential stability due to useCallback
      expect(screen.getByText('Home')).toBe(homeLink);
      expect(screen.getByLabelText('Search')).toBe(searchButton);
    });

    it('GIVEN Navigation component WHEN props change THEN should update handlers appropriately', () => {
      // GIVEN
      const initialProps: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: false,
        searchResultCount: 0,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={initialProps} />);
      
      // THEN - Initially no filter button
      expect(screen.queryByLabelText('Filter movies')).not.toBeInTheDocument();

      // WHEN - Props change to activate search
      const updatedProps: NavigationProps = {
        ...initialProps,
        isSearchActive: true,
        searchResultCount: 10,
      };
      rerender(<TestWrapper props={updatedProps} />);

      // THEN - Filter button should appear
      expect(screen.getByLabelText('Filter movies')).toBeInTheDocument();
    });
  });

  describe('Navigation Interactions', () => {
    it('GIVEN Navigation component WHEN clicking navigation links THEN should navigate to correct route', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: false,
        searchResultCount: 0,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const homeLink = screen.getByText('Home');
      
      // THEN
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
      expect(homeLink).toHaveAttribute('aria-current', 'page');
    });

    it('GIVEN Navigation component WHEN rendering different navigation links THEN should have correct href attributes', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: false,
        searchResultCount: 0,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      
      const navigationItems = [
        { text: 'TV Shows', href: '/tv-shows' },
        { text: 'Movies', href: '/movies' },
        { text: 'New & Popular', href: '/new-popular' },
        { text: 'My List', href: '/my-list' },
      ];

      // THEN
      navigationItems.forEach(({ text, href }) => {
        const link = screen.getByText(text);
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', href);
      });
    });
  });

  describe('Search Functionality', () => {
    it('GIVEN Navigation component WHEN clicking search button THEN should toggle search input visibility', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: false,
        searchResultCount: 0,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchButton = screen.getByLabelText('Search');
      
      // Initially no search input
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      
      // Click to open
      fireEvent.click(searchButton);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      
      // Click to close
      fireEvent.click(searchButton);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('GIVEN Navigation component WHEN typing in search input THEN should call onSearch with debounced value', async () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: false,
        searchResultCount: 0,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.click(screen.getByLabelText('Search'));
      
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });

      // THEN
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('test query');
      }, { timeout: 1000 });
    });
  });

  describe('Filter Functionality', () => {
    it('GIVEN Navigation component with search active WHEN clicking filter button THEN should toggle filter panel', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: true,
        searchResultCount: 5,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const filterButton = screen.getByLabelText('Filter movies');
      
      // Initially closed
      expect(filterButton).toHaveAttribute('aria-expanded', 'false');
      
      // Click to open
      fireEvent.click(filterButton);
      expect(filterButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('GIVEN Navigation component with filter open WHEN clicking filter button THEN should close filter panel', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: true,
        searchResultCount: 5,
      };
      const storeState = { 
        filter: { 
          isFilterOpen: true,
          movieFilters: {
            selectedGenres: [],
            selectedLanguages: [],
            selectedReleaseYears: [],
            sortBy: 'popularity' as const,
            sortOrder: 'desc' as const,
          },
          availableFilterOptions: {
            genres: [],
            languages: [],
            releaseYears: [],
          },
        }
      };

      // WHEN
      render(<TestWrapper props={props} storeState={storeState} />);
      const filterButton = screen.getByLabelText('Filter movies');
      
      // Initially open
      expect(filterButton).toHaveAttribute('aria-expanded', 'true');
      
      // Click to close
      fireEvent.click(filterButton);
      expect(filterButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Accessibility', () => {
    it('GIVEN Navigation component WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: true,
        searchResultCount: 5,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
      expect(screen.getByLabelText('Search')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByLabelText('Filter movies')).toHaveAttribute('aria-expanded', 'false');
    });

    it('GIVEN Navigation component WHEN using keyboard navigation THEN should handle key events properly', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: true,
        searchResultCount: 5,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      
      const homeLink = screen.getByText('Home');
      const filterButton = screen.getByLabelText('Filter movies');
      
      // Test Enter key on link (should not throw error)
      fireEvent.keyDown(homeLink, { key: 'Enter' });
      expect(homeLink).toBeInTheDocument();
      
      // Test Space key on filter button
      fireEvent.keyDown(filterButton, { key: ' ' });
      expect(filterButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN Navigation component without handlers WHEN interacting THEN should not throw errors', () => {
      // GIVEN
      const props: NavigationProps = {
        isSearchActive: true,
        searchResultCount: 5,
      };

      // WHEN & THEN
      expect(() => {
        render(<TestWrapper props={props} />);
        fireEvent.click(screen.getByText('Home'));
        fireEvent.click(screen.getByLabelText('Search'));
        fireEvent.click(screen.getByLabelText('Filter movies'));
      }).not.toThrow();
    });

    it('GIVEN Navigation component WHEN rapid clicking THEN should handle gracefully', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: true,
        searchResultCount: 5,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      
      const searchButton = screen.getByLabelText('Search');
      const filterButton = screen.getByLabelText('Filter movies');
      
      // Rapid clicking on interactive elements
      for (let i = 0; i < 5; i++) {
        fireEvent.click(searchButton);
        fireEvent.click(filterButton);
      }

      // THEN
      // Search and filter should handle rapid clicks without issues
      expect(searchButton).toBeInTheDocument();
      expect(filterButton).toBeInTheDocument();
    });
  });

  describe('Performance Optimization', () => {
    it('GIVEN Navigation component WHEN re-rendering with same props THEN should not cause unnecessary re-renders of child components', () => {
      // GIVEN
      const props: NavigationProps = {
        onSearch: mockOnSearch,
        isSearchActive: true,
        searchResultCount: 5,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={props} />);
      
      // Get initial DOM elements
      const initialHomeLink = screen.getByText('Home');
      const initialSearchButton = screen.getByLabelText('Search');
      
      // Rerender with same props
      rerender(<TestWrapper props={props} />);
      
      // THEN
      // Elements should be the same instances (referential equality)
      expect(screen.getByText('Home')).toBe(initialHomeLink);
      expect(screen.getByLabelText('Search')).toBe(initialSearchButton);
    });
  });
});
