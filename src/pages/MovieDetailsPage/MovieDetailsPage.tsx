import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type MovieDetails, type MovieDetailsPageProps } from '../../types/movie.types';
import { useMoviesQuery } from '../../hooks/useMoviesQuery';
import { Navigation } from '../../components/Navigation';
import { MovieDetailsDisplay } from './MovieDetailsDisplay';
import './MovieDetailsPage.css';

/**
 * MovieDetailsPage component that displays detailed information about a specific movie
 * Uses React Query for data fetching and Redux for state management
 */
export const MovieDetailsPage: React.FC<Partial<MovieDetailsPageProps>> = ({
  onBack,
  onPlayClick,
  onMoreInfoClick,
  onSearch,
}) => {
  const { id: movieId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use React Query hook to fetch movie details
  const {
    data: movie,
    isLoading,
    isError,
    error,
    refetch,
  } = useMoviesQuery.useMovieDetailsQuery(movieId || '');

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  // Handle play button click
  const handlePlayClick = (movie: MovieDetails) => {
    if (onPlayClick) {
      onPlayClick(movie);
    } else {
      // Default behavior: could open a video player or external link
    }
  };

  // Handle more info button click
  const handleMoreInfoClick = (movie: MovieDetails) => {
    if (onMoreInfoClick) {
      onMoreInfoClick(movie);
    } else {
      // Default behavior: could open external movie info page
      if (movie.homepage) {
        window.open(movie.homepage, '_blank');
      } else if (movie.imdb_id) {
        window.open(`https://www.imdb.com/title/${movie.imdb_id}`, '_blank');
      }
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    } else {
      // Default search behavior
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  // Get error message
  const getErrorMessage = (): string | null => {
    if (!isError || !error) return null;
    
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return error.message as string;
    }
    
    return 'An unknown error occurred';
  };

  return (
    <div className="movie-details-page">
      <Navigation
        onSearch={handleSearch}
        currentSection="movie-details"
      />
      
      <div className="movie-details-page__content">
        {isLoading ? (
          <div data-testid="loading" className="movie-details-page__loading">
            Loading movie details...
          </div>
        ) : isError ? (
          <div data-testid="error" className="movie-details-page__error">
            <h2>Error Loading Movie</h2>
            <p>Error: {getErrorMessage()}</p>
            <button
              onClick={handleRetry}
              className="movie-details-page__error button"
            >
              Retry
            </button>
          </div>
        ) : (
          <MovieDetailsDisplay
            movie={movie as MovieDetails}
            loading={isLoading}
            error={getErrorMessage()}
            onBack={handleBack}
            onPlayClick={handlePlayClick}
            onMoreInfoClick={handleMoreInfoClick}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
};
