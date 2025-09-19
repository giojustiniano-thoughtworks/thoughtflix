import React, { useCallback, useMemo } from 'react';
import { type Movie } from '../../types/movie.types';
import './MovieCard.css';

export interface MovieCardProps {
  /** Movie data to display */
  readonly movie: Movie;
  /** Callback function called when card is clicked */
  readonly onClick?: (movie: Movie) => void;
  /** Whether the card is disabled */
  readonly disabled?: boolean;
  /** Size variant of the card */
  readonly size?: 'small' | 'medium' | 'large';
  /** Additional CSS class name */
  readonly className?: string;
  /** Whether to show loading state */
  readonly loading?: boolean;
  /** Whether to show hover effects */
  readonly hoverable?: boolean;
}

// Custom hook for movie card logic
const useMovieCardLogic = (movie: Movie) => {
  // Memoized computed values
  const posterUrl = useMemo(() => {
    if (!movie.poster_path || movie.poster_path === 'null' || movie.poster_path.trim() === '') {
      return '/placeholder-movie.jpg';
    }
    return movie.poster_path;
  }, [movie.poster_path]);

  const releaseYear = useMemo(() => {
    try {
      return new Date(movie.release_date).getFullYear();
    } catch {
      return 'N/A';
    }
  }, [movie.release_date]);

  const truncatedOverview = useMemo(() => {
    const maxLength = 100;
    const overview = movie.overview || '';
    return overview.length > maxLength 
      ? `${overview.substring(0, maxLength)}...` 
      : overview;
  }, [movie.overview]);

  const rating = useMemo(() => 
    (movie.vote_average || 0).toFixed(1),
    [movie.vote_average]
  );

  return {
    posterUrl,
    releaseYear,
    truncatedOverview,
    rating,
  };
};

// Poster Image Component
interface PosterImageProps {
  readonly src: string;
  readonly alt: string;
  readonly loading?: 'lazy' | 'eager';
}

const PosterImage: React.FC<PosterImageProps> = React.memo(({ 
  src, 
  alt, 
  loading = 'lazy' 
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [hasErrored, setHasErrored] = React.useState(false);

  const handleError = useCallback(() => {
    if (!hasErrored) {
      setHasErrored(true);
      setImageSrc('/placeholder-movie.jpg');
    }
  }, [hasErrored]);

  React.useEffect(() => {
    setImageSrc(src);
    setHasErrored(false);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      className="movie-card__poster"
    />
  );
});

PosterImage.displayName = 'PosterImage';

// Movie Info Component
interface MovieInfoProps {
  readonly title: string;
  readonly releaseYear: string | number;
  readonly rating: string;
  readonly overview: string;
}

const MovieInfo: React.FC<MovieInfoProps> = React.memo(({ 
  title, 
  releaseYear, 
  rating, 
  overview 
}) => {
  return (
    <div className="movie-card__info">
      <h3 className="movie-card__title">{title}</h3>
      <p className="movie-card__year">{releaseYear}</p>
      <p className="movie-card__rating">
        ⭐ {rating}
      </p>
      <p className="movie-card__overview">
        {overview}
      </p>
    </div>
  );
});

MovieInfo.displayName = 'MovieInfo';

// Loading Overlay Component
const LoadingOverlay: React.FC = React.memo(() => (
  <div className="movie-card__loading-overlay">
    <div className="movie-card__spinner"></div>
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';

// Main MovieCard Component
export const MovieCard: React.FC<MovieCardProps> = React.memo(({
  movie,
  onClick,
  disabled = false,
  size = 'medium',
  className = '',
  loading = false,
  hoverable = true,
}) => {
  // Custom hook for movie card logic
  const { posterUrl, releaseYear, truncatedOverview, rating } = useMovieCardLogic(movie);

  // Event handlers with useCallback for optimization
  const handleClick = useCallback(() => {
    if (!disabled && !loading && onClick) {
      onClick(movie);
    }
  }, [disabled, loading, onClick, movie]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // Memoized computed values
  const cardClasses = useMemo(() => [
    'movie-card',
    `movie-card--${size}`,
    disabled ? 'movie-card--disabled' : '',
    loading ? 'movie-card--loading' : '',
    hoverable ? 'movie-card--hoverable' : '',
    className,
  ].filter(Boolean).join(' '), [size, disabled, loading, hoverable, className]);

  const ariaLabel = useMemo(() => 
    `View details for ${movie.title}`,
    [movie.title]
  );

  const tabIndex = useMemo(() => 
    disabled ? -1 : 0,
    [disabled]
  );

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role="button"
      aria-label={ariaLabel}
      data-testid="movie-card"
    >
      <div className="movie-card__poster-container">
        <PosterImage
          src={posterUrl}
          alt={`${movie.title} poster`}
          loading="lazy"
        />
        {loading && <LoadingOverlay />}
      </div>
      
      <MovieInfo
        title={movie.title}
        releaseYear={releaseYear}
        rating={rating}
        overview={truncatedOverview}
      />
    </div>
  );
});

MovieCard.displayName = 'MovieCard';
