import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type NavigationProps, type MovieFilters } from '../../types/movie.types';
import { ROUTES } from '../../router/routing.types';
import { SearchBar } from '../SearchBar';
import { MovieFilter } from '../MovieFilter';
import { toggleFilter, updateFilters, clearFilters } from '../../store/slices/filterSlice';
import { type RootState } from '../../store/store';
import './Navigation.css';

// Navigation item type for better type safety
interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly path: string;
}

// Navigation items constant for better performance
const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { id: 'home', label: 'Home', path: ROUTES.HOME },
  { id: 'tv-shows', label: 'TV Shows', path: ROUTES.TV_SHOWS },
  { id: 'movies', label: 'Movies', path: ROUTES.MOVIES },
  { id: 'new-popular', label: 'New & Popular', path: ROUTES.NEW_POPULAR },
  { id: 'my-list', label: 'My List', path: ROUTES.MY_LIST },
] as const;

// Custom hook for navigation logic
const useNavigationLogic = () => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Navigation is handled by React Router Link component
    }
  }, []);

  return {
    handleKeyDown,
  };
};

// Custom hook for search logic
const useSearchLogic = (onSearch?: (query: string) => void) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      onSearch?.(query);
    }
  }, [onSearch]);

  const handleSearchFocus = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    // Keep search open when focused, only close on explicit toggle
  }, []);

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return {
    isSearchOpen,
    searchContainerRef,
    handleSearchToggle,
    handleSearch,
    handleSearchFocus,
    handleSearchBlur,
  };
};

// Custom hook for filter logic
const useFilterLogic = () => {
  const dispatch = useDispatch();
  
  // Get filter state from Redux
  const { isFilterOpen, movieFilters, availableFilterOptions } = useSelector((state: RootState) => state.filter);

  const handleFilterToggle = useCallback(() => {
    dispatch(toggleFilter());
  }, [dispatch]);

  const handleFiltersChange = useCallback((filters: Partial<MovieFilters>) => {
    dispatch(updateFilters(filters));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleApplyFilters = useCallback(() => {
    // Close the filter panel after applying
    dispatch(toggleFilter());
    // Filters are automatically applied to movie data through Redux state
    // The HomePage component uses the filter state to filter search results
  }, [dispatch]);

  const handleFilterKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFilterToggle();
    }
  }, [handleFilterToggle]);

  return {
    isFilterOpen,
    movieFilters,
    availableFilterOptions,
    handleFilterToggle,
    handleFiltersChange,
    handleClearFilters,
    handleApplyFilters,
    handleFilterKeyDown,
  };
};

// Navigation Link Component
interface NavigationLinkProps {
  readonly item: NavigationItem;
  readonly isActive: boolean;
  readonly onKeyDown: (event: React.KeyboardEvent) => void;
  readonly onClearSearch?: () => void;
}

const NavigationLink: React.FC<NavigationLinkProps> = React.memo(({ 
  item, 
  isActive, 
  onKeyDown,
  onClearSearch
}) => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    onKeyDown(event);
  }, [onKeyDown]);

  const handleClick = useCallback(() => {
    // Clear search when clicking Home
    if (item.id === 'home' && onClearSearch) {
      onClearSearch();
    }
  }, [item.id, onClearSearch]);

  return (
    <Link
      key={item.id}
      to={item.path}
      className={`navigation__link ${
        isActive ? 'navigation__link--active' : ''
      }`}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.label}
    </Link>
  );
});

NavigationLink.displayName = 'NavigationLink';

// Search Button Component
interface SearchButtonProps {
  readonly isSearchOpen: boolean;
  readonly onToggle: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = React.memo(({ isSearchOpen, onToggle }) => {
  return (
    <button
      className="navigation__search-button"
      onClick={onToggle}
      aria-label="Search"
      aria-expanded={isSearchOpen}
    >
      <span className="navigation__search-icon">🔍</span>
    </button>
  );
});

SearchButton.displayName = 'SearchButton';

// Filter Button Component
interface FilterButtonProps {
  readonly isFilterOpen: boolean;
  readonly onToggle: () => void;
  readonly onKeyDown: (event: React.KeyboardEvent) => void;
}

const FilterButton: React.FC<FilterButtonProps> = React.memo(({ 
  isFilterOpen, 
  onToggle, 
  onKeyDown 
}) => {
  return (
    <button
      className="navigation__filter-button"
      onClick={onToggle}
      onKeyDown={onKeyDown}
      aria-label="Filter movies"
      aria-expanded={isFilterOpen}
    >
      <span className="navigation__filter-icon">🔧</span>
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

// Search Container Component
interface SearchContainerProps {
  readonly isOpen: boolean;
  readonly containerRef: React.RefObject<HTMLDivElement | null>;
  readonly onSearch: (query: string) => void;
  readonly onFocus: () => void;
  readonly onBlur: () => void;
}

const SearchContainer: React.FC<SearchContainerProps> = React.memo(({ 
  isOpen, 
  containerRef, 
  onSearch, 
  onFocus, 
  onBlur 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="navigation__search-backdrop" onClick={() => {}} />
      <div ref={containerRef} className="navigation__search-container">
        <SearchBar
          onSearch={onSearch}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search for movies..."
          showClearButton={true}
          debounceMs={300}
          className="navigation__search-bar"
        />
      </div>
    </>
  );
});

SearchContainer.displayName = 'SearchContainer';

// Main Navigation Component
export const Navigation: React.FC<NavigationProps> = React.memo(({
  onSearch,
  onClearSearch,
  isSearchActive = false,
  searchResultCount = 0,
}) => {
  const location = useLocation();
  
  // Custom hooks for different concerns
  const { handleKeyDown } = useNavigationLogic();
  const { 
    isSearchOpen, 
    searchContainerRef, 
    handleSearchToggle, 
    handleSearch, 
    handleSearchFocus, 
    handleSearchBlur 
  } = useSearchLogic(onSearch);
  const {
    isFilterOpen,
    movieFilters,
    availableFilterOptions,
    handleFilterToggle,
    handleFiltersChange,
    handleClearFilters,
    handleApplyFilters,
    handleFilterKeyDown,
  } = useFilterLogic();

  // Memoized navigation items with active state
  const navigationItemsWithState = useMemo(() => 
    NAVIGATION_ITEMS.map(item => ({
      ...item,
      isActive: location.pathname === item.path,
    })), [location.pathname]
  );

  return (
    <nav
      data-testid="navigation"
      className="navigation"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navigation__container">
        <div className="navigation__brand">
          <span className="navigation__logo">THOUGHTFLIX</span>
        </div>

        <div className="navigation__menu">
          {navigationItemsWithState.map((item) => (
            <NavigationLink
              key={item.id}
              item={item}
              isActive={item.isActive}
              onKeyDown={handleKeyDown}
              onClearSearch={onClearSearch}
            />
          ))}
        </div>

        <div className="navigation__actions">
          {isSearchActive && (
            <FilterButton
              isFilterOpen={isFilterOpen}
              onToggle={handleFilterToggle}
              onKeyDown={handleFilterKeyDown}
            />
          )}

          <SearchButton
            isSearchOpen={isSearchOpen}
            onToggle={handleSearchToggle}
          />

          <SearchContainer
            isOpen={isSearchOpen}
            containerRef={searchContainerRef}
            onSearch={handleSearch}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
        </div>
      </div>

      {/* Movie Filter Modal */}
      <MovieFilter
        isOpen={isFilterOpen}
        onToggle={handleFilterToggle}
        filters={movieFilters}
        availableOptions={availableFilterOptions}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        onApplyFilters={handleApplyFilters}
        resultCount={searchResultCount}
      />
    </nav>
  );
});

Navigation.displayName = 'Navigation';
