import React from 'react';
import { type HeroSectionProps } from '../../types/movie.types';
import './HeroSection.css';

export const HeroSection: React.FC<HeroSectionProps> = ({
  movie,
  onPlayClick,
  onMoreInfoClick,
}) => {
  const handlePlayClick = () => {
    onPlayClick?.(movie);
  };

  const handleMoreInfoClick = () => {
    onMoreInfoClick?.(movie);
  };

  const handleKeyDown = (event: React.KeyboardEvent, handler: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };

  // Handle null movie gracefully
  if (!movie) {
    return (
      <div data-testid="hero-section" className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content" data-testid="hero-content">
          <div className="hero-info">
            <h1 data-testid="hero-title" className="hero-title">
              No movie available
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="hero-section"
      className="hero-section"
      style={{
        backgroundImage: `url(${movie.backdrop_path})`,
      }}
    >
      <div className="hero-overlay" />
      <div className="hero-content" data-testid="hero-content">
        <div className="hero-info">
          <h1 data-testid="hero-title" className="hero-title">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="hero-tagline">{movie.tagline}</p>
          )}
          <p data-testid="hero-overview" className="hero-overview">
            {movie.overview}
          </p>
          <div data-testid="hero-actions" className="hero-actions">
            <button
              className="hero-button hero-button--primary"
              onClick={handlePlayClick}
              onKeyDown={(e) => handleKeyDown(e, handlePlayClick)}
              aria-label="Play"
              tabIndex={0}
            >
              <span className="hero-button-icon">▶</span>
              Play
            </button>
            <button
              className="hero-button hero-button--secondary"
              onClick={handleMoreInfoClick}
              onKeyDown={(e) => handleKeyDown(e, handleMoreInfoClick)}
              aria-label="More Info"
              tabIndex={0}
            >
              <span className="hero-button-icon">ℹ</span>
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
