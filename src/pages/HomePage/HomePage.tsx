import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigation } from '../../components/Navigation';
import { HeroSection } from '../../components/HeroSection';
import { MovieSection } from '../../components/MovieSection';
import { SearchResults } from '../../components/SearchResults';
import { useNavigation } from '../../hooks/useNavigation';
import { type HeroMovie, type Movie } from '../../types/movie.types';
import { useMoviesQuery } from '../../hooks/useMoviesQuery';
import { type RootState } from '../../store/store';
import { applyFilters } from '../../utils/filterUtils';
import './HomePage.css';

export const HomePage: React.FC = () => {
  // Get navigation handlers from context
  const { onPlayClick, onMoreInfoClick, onMovieClick, onSearch } = useNavigation();
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get filter state from Redux
  const { movieFilters } = useSelector((state: RootState) => state.filter);


  // Handler to clear search from navigation
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // React Query hooks
  const homePageQuery = useMoviesQuery.useHomePageQuery();
  const searchQueryResult = useMoviesQuery.useMovieSearchQuery({ 
    query: searchQuery,
    page: 1 
  });

  const handlePlayClick = (movie?: HeroMovie | null) => {
    if (movie) onPlayClick?.(movie);
  };

  const handleMoreInfoClick = (movie?: HeroMovie | null) => {
    if (movie) onMoreInfoClick?.(movie);
  };

  const handleMovieClick = (movie: Movie) => {
    onMovieClick?.(movie);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleBackToHome = () => {
    setSearchQuery('');
  };

  const handleSearchRetry = () => {
    // Trigger a refetch of the search query
    searchQueryResult.refetch();
  };

  // Determine loading state
  const isLoading = homePageQuery.isLoading;

  // Determine error state
  const error = homePageQuery.error;

  // Determine if we're showing search results or homepage data
  const isShowingSearchResults = searchQuery.trim() !== '';
  const searchError = searchQueryResult.error;
  const searchLoading = searchQueryResult.isLoading;
  
  // Memoize search movies to prevent unnecessary re-renders
  const searchMovies = useMemo(() => {
    return searchQueryResult.data?.results || [];
  }, [searchQueryResult.data?.results]);
  
  // Calculate filtered search results for count display
  const filteredSearchMovies = useMemo(() => {
    if (!isShowingSearchResults || !searchMovies || searchMovies.length === 0) return [];
    return applyFilters(searchMovies, movieFilters);
  }, [isShowingSearchResults, searchMovies, movieFilters]);

  // Show search results if user is searching
  if (isShowingSearchResults) {
    return (
      <div data-testid="homepage" className="homepage">
        <Navigation
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          currentSection="home"
          isSearchActive={true}
          searchResultCount={filteredSearchMovies.length}
        />
        <SearchResults
          searchQuery={searchQuery}
          movies={searchMovies}
          loading={searchLoading}
          error={searchError?.message}
          onMovieClick={handleMovieClick}
          onBackToHome={handleBackToHome}
          onRetry={handleSearchRetry}
          filters={movieFilters}
        />
      </div>
    );
  }

  // Show homepage data
  if (isLoading) {
    return <div data-testid="homepage-loading" className="homepage-loading">Loading homepage data...</div>;
  }

  if (error) {
    return <div data-testid="homepage-error" className="homepage-error">Error: {error.message}</div>;
  }

  const displayData = homePageQuery.data;
  if (!displayData || (!displayData.heroMovie && displayData.sections.length === 0)) {
    return <div data-testid="homepage-empty" className="homepage-empty">No movie data available.</div>;
  }

  return (
    <div data-testid="homepage" className="homepage">
      <Navigation
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSection="home"
      />
      {displayData.heroMovie && (
        <HeroSection
          movie={displayData.heroMovie}
          onPlayClick={handlePlayClick}
          onMoreInfoClick={handleMoreInfoClick}
        />
      )}
      <div className="homepage__content">
        {displayData.sections.map((section) => (
          <MovieSection
            key={section.title}
            title={section.title}
            movies={section.movies}
            type={section.type as 'big_hits' | 'recently_released' | 'top_rated' | 'trending'}
            onMovieClick={handleMovieClick}
          />
        ))}
      </div>
    </div>
  );
};