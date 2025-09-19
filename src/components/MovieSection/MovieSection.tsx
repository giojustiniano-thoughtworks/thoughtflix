import React from 'react';
import { MovieCard } from '../MovieCard';
import { type MovieSectionProps, type Movie } from '../../types/movie.types';
import './MovieSection.css';

export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  type,
  onMovieClick,
}) => {
  const handleMovieClick = (movie: Movie) => {
    onMovieClick?.(movie);
  };

  const getSectionClass = () => {
    const baseClass = 'movie-section';
    const typeClass = `movie-section--${type.replace('_', '-')}`;
    const emptyClass = movies.length === 0 ? 'movie-section--empty' : '';
    return [baseClass, typeClass, emptyClass].filter(Boolean).join(' ');
  };

  const renderEmptyState = () => (
    <div className="movie-section__empty">
      <p className="movie-section__empty-message">No movies available</p>
    </div>
  );

  const renderMovies = () => (
    <div className="movie-scroll-container" data-testid="movie-scroll-container">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={handleMovieClick}
          size={type === 'big_hits' ? 'large' : 'medium'}
        />
      ))}
    </div>
  );

  return (
    <section
      data-testid="movie-section"
      className={getSectionClass()}
      role="region"
      aria-label={`${title} movies`}
    >
      <div className="movie-section__header">
        <h2 className="movie-section__title">{title}</h2>
      </div>
      <div className="movie-section__content">
        {movies.length === 0 ? renderEmptyState() : renderMovies()}
      </div>
    </section>
  );
};
