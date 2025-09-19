import React, { useCallback, useEffect, useMemo } from 'react';
import { type SearchResultsProps, type Movie, type MovieFilters } from '../../types/movie.types';
import { applyFilters } from '../../utils/filterUtils';
import { MovieCard } from '../MovieCard';
import './SearchResults.css';

// Custom hook for search results logic
const useSearchResultsLogic = (
  movies: Movie[],
  filters?: MovieFilters
) => {
  // Apply filters to movies
  const filteredMovies = useMemo(() => {
    if (!filters) return movies;
    return applyFilters(movies, filters);
  }, [movies, filters]);

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    if (!filters) return false;
    return (
      filters.selectedGenres.length > 0 ||
      filters.selectedLanguages.length > 0 ||
      filters.selectedReleaseYears.length > 0
    );
  }, [filters]);

  return {
    filteredMovies,
    hasActiveFilters,
  };
};

// Custom hook for keyboard navigation
const useKeyboardNavigation = (
  onBackToHome: () => void
) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onBackToHome();
    }
  }, [onBackToHome]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};


// Loading Component
const LoadingState: React.FC = React.memo(() => (
  <div className="search-results__loading" data-testid="search-results-loading">
    <div className="search-results__spinner"></div>
    <p>Searching for movies...</p>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Error Component
interface ErrorStateProps {
  readonly error: string;
  readonly onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = React.memo(({ error, onRetry }) => {
  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  return (
    <div className="search-results__error">
      <h3>Oops! Something went wrong</h3>
      <p>Error: {error}</p>
      {onRetry && (
        <button
          className="search-results__retry-button"
          onClick={handleRetry}
          aria-label="Try searching again"
        >
          Try Again
        </button>
      )}
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

// No Results Component
interface NoResultsProps {
  readonly hasActiveFilters: boolean;
}

const NoResults: React.FC<NoResultsProps> = React.memo(({ hasActiveFilters }) => {
  const message = hasActiveFilters
    ? 'No movies match your current filters. Try adjusting your filter criteria.'
    : 'No movies found. Try a different search term.';

  return (
    <div className="search-results__no-results">
      <h3>No Results Found</h3>
      <p>{message}</p>
    </div>
  );
});

NoResults.displayName = 'NoResults';

// Header Component
interface SearchResultsHeaderProps {
  readonly searchQuery: string;
  readonly resultCount: number;
  readonly onBackToHome: () => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = React.memo(({ 
  searchQuery, 
  resultCount, 
  onBackToHome 
}) => {
  const handleBackClick = useCallback(() => {
    onBackToHome();
  }, [onBackToHome]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBackClick();
    }
  }, [handleBackClick]);

  return (
    <div className="search-results__header">
      <button
        className="search-results__back-button"
        onClick={handleBackClick}
        onKeyDown={handleKeyDown}
        aria-label="Back to Home"
      >
        ← Back to Home
      </button>
      <h2 className="search-results__title">
        Search results for "{searchQuery}"
        {resultCount > 0 && (
          <span className="search-results__count">({resultCount} results)</span>
        )}
      </h2>
    </div>
  );
});

SearchResultsHeader.displayName = 'SearchResultsHeader';

// Movie Grid Component
interface MovieGridProps {
  readonly movies: Movie[];
  readonly onMovieClick: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = React.memo(({ movies, onMovieClick }) => {
  const handleMovieClick = useCallback((movie: Movie) => {
    onMovieClick(movie);
  }, [onMovieClick]);

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="search-results__grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={handleMovieClick}
          className="search-results__movie-card"
        />
      ))}
    </div>
  );
});

MovieGrid.displayName = 'MovieGrid';

// Main SearchResults Component
export const SearchResults: React.FC<SearchResultsProps> = React.memo(({
  searchQuery,
  movies = [],
  loading = false,
  error,
  onMovieClick,
  onBackToHome,
  onRetry,
  filters,
}) => {
  // Custom hooks for different concerns
  const { filteredMovies, hasActiveFilters } = useSearchResultsLogic(movies, filters);
  
  // Keyboard navigation
  useKeyboardNavigation(onBackToHome);

  // Memoized event handlers
  const handleMovieClick = useCallback((movie: Movie) => {
    onMovieClick(movie);
  }, [onMovieClick]);

  const handleBackToHome = useCallback(() => {
    onBackToHome();
  }, [onBackToHome]);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  // Memoized computed values
  const resultCount = filteredMovies.length;
  const hasResults = resultCount > 0;
  const showNoResults = !loading && !error && !hasResults;

  // Container classes
  const containerClasses = useMemo(() => [
    'search-results',
    loading ? 'search-results--loading' : '',
    error ? 'search-results--error' : '',
    showNoResults ? 'search-results--no-results' : '',
  ].filter(Boolean).join(' '), [loading, error, showNoResults]);

  return (
    <div className={containerClasses} data-testid="search-results" role="region" aria-label="Search results">
      <div className="search-results__container">
        <SearchResultsHeader
          searchQuery={searchQuery}
          resultCount={resultCount}
          onBackToHome={handleBackToHome}
        />

        <div className="search-results__content">
          {loading && <LoadingState />}
          
          {error && (
            <ErrorState
              error={error}
              {...(onRetry && { onRetry: handleRetry })}
            />
          )}
          
          {showNoResults && (
            <NoResults hasActiveFilters={hasActiveFilters} />
          )}
          
          {!loading && !error && hasResults && (
            <MovieGrid
              movies={filteredMovies}
              onMovieClick={handleMovieClick}
            />
          )}
        </div>
      </div>
    </div>
  );
});

SearchResults.displayName = 'SearchResults';
