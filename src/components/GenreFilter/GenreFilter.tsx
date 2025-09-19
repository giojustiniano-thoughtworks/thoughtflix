import React from 'react';
import { type GenreFilterProps } from '../../types/movie.types';
import './GenreFilter.css';

export const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenres,
  onGenreToggle,
  onSelectAll,
  onClearAll,
}) => {
  const handleGenreClick = (genreId: number) => {
    onGenreToggle?.(genreId);
  };

  const handleSelectAll = () => {
    onSelectAll?.();
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  if (genres.length === 0) {
    return (
      <div className="genre-filter">
        <div className="genre-filter__empty">
          <p>No genres available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genre-filter">
      <div className="genre-filter__header">
        <h4 className="genre-filter__title">Genres</h4>
        <div className="genre-filter__actions">
          <button
            type="button"
            className="genre-filter__action"
            onClick={handleSelectAll}
            aria-label="Select all genres"
          >
            Select All
          </button>
          <button
            type="button"
            className="genre-filter__action"
            onClick={handleClearAll}
            aria-label="Clear all genre selections"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <ul className="genre-filter__list" role="list" aria-label="Select genres">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          
          return (
            <li key={genre.id} className="genre-filter__item">
              <button
                type="button"
                className={`genre-filter__item-button ${
                  isSelected ? 'genre-filter__item--active' : ''
                }`}
                onClick={() => handleGenreClick(genre.id)}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? 'Deselect' : 'Select'} ${genre.name} genre`}
              >
                <span className="genre-filter__item-text">{genre.name}</span>
                {isSelected && (
                  <span className="genre-filter__item-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
