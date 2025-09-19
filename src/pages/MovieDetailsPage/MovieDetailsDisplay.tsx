import React from 'react';
import { type MovieDetailsDisplayProps } from '../../types/movie.types';
import './MovieDetailsDisplay.css';

/**
 * MovieDetailsDisplay component that renders detailed movie information
 * Displays movie title, overview, release date, genres, rating, and other details
 */
export const MovieDetailsDisplay: React.FC<MovieDetailsDisplayProps> = ({
  movie,
  loading = false,
  error = null,
  onBack,
  onPlayClick,
  onMoreInfoClick,
  onRetry,
}) => {
  // Show loading state
  if (loading) {
    return (
      <div data-testid="movie-details-display" className="movie-details-display">
        <div data-testid="loading" className="movie-details-display__loading">
          Loading movie details...
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div data-testid="movie-details-display" className="movie-details-display">
        <div data-testid="error" className="movie-details-display__error">
          <h2>Error Loading Movie</h2>
          <p>Error: {error}</p>
          {onRetry && (
            <button onClick={onRetry} className="movie-details-display__button movie-details-display__button--primary">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show empty state if no movie data
  if (!movie) {
    return (
      <div data-testid="movie-details-display" className="movie-details-display">
        <div className="movie-details-display__error">
          <h2>No Movie Data</h2>
          <p>Unable to load movie details.</p>
          {onBack && (
            <button onClick={onBack} className="movie-details-display__button movie-details-display__button--back">
              Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Format runtime for display
  const formatRuntime = (runtime: number): string => {
    if (runtime === 0) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Format release date for display
  const formatReleaseDate = (dateString: string): string => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Format rating for display
  const formatRating = (rating: number): string => {
    return rating > 0 ? rating.toFixed(1) : 'N/A';
  };

  return (
    <div data-testid="movie-details-display" className="movie-details-display">
      <div className="movie-details-display__content">
        {/* Movie Poster */}
        <div className="movie-details-display__poster">
          <img
            src={movie.poster_path || '/placeholder-movie.jpg'}
            alt={`${movie.title} poster`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-movie.jpg';
            }}
          />
        </div>

        {/* Movie Information */}
        <div className="movie-details-display__info">
          {/* Title */}
          <h1 data-testid="movie-title" className="movie-details-display__title">
            {movie.title}
          </h1>

          {/* Tagline */}
          {movie.tagline && (
            <p data-testid="movie-tagline" className="movie-details-display__tagline">
              {movie.tagline}
            </p>
          )}

          {/* Overview */}
          <p data-testid="movie-overview" className="movie-details-display__overview">
            {movie.overview || 'No overview available.'}
          </p>

          {/* Movie Metadata */}
          <div className="movie-details-display__meta">
            <div className="movie-details-display__meta-item">
              <span className="movie-details-display__meta-label">Release Date</span>
              <span data-testid="movie-release-date" className="movie-details-display__meta-value">
                {formatReleaseDate(movie.release_date)}
              </span>
            </div>

            <div className="movie-details-display__meta-item">
              <span className="movie-details-display__meta-label">Rating</span>
              <span data-testid="movie-rating" className="movie-details-display__meta-value">
                {formatRating(movie.vote_average)}/10
              </span>
            </div>

            <div className="movie-details-display__meta-item">
              <span className="movie-details-display__meta-label">Runtime</span>
              <span data-testid="movie-runtime" className="movie-details-display__meta-value">
                {formatRuntime(movie.runtime)}
              </span>
            </div>

            <div className="movie-details-display__meta-item">
              <span className="movie-details-display__meta-label">Status</span>
              <span data-testid="movie-status" className="movie-details-display__meta-value">
                {movie.status || 'N/A'}
              </span>
            </div>
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-details-display__genres">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  data-testid={`genre-${genre.id}`}
                  className="movie-details-display__genre"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="movie-details-display__actions">
            {onBack && (
              <button
                onClick={onBack}
                className="movie-details-display__button movie-details-display__button--back"
                aria-label="Go back to previous page"
              >
                Back
              </button>
            )}

            {onPlayClick && (
              <button
                onClick={() => onPlayClick(movie)}
                className="movie-details-display__button movie-details-display__button--primary"
                aria-label={`Play ${movie.title}`}
              >
                Play
              </button>
            )}

            {onMoreInfoClick && (
              <button
                onClick={() => onMoreInfoClick(movie)}
                className="movie-details-display__button movie-details-display__button--secondary"
                aria-label={`More information about ${movie.title}`}
              >
                More Info
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

