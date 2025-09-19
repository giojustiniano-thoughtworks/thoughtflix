import React from 'react';
import { type FilterButtonProps } from '../../types/movie.types';
import './FilterButton.css';

export const FilterButton: React.FC<FilterButtonProps> = ({
  isActive,
  onClick,
  children,
  count,
}) => {
  return (
    <button
      type="button"
      className={`filter-button ${isActive ? 'filter-button--active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span className="filter-button__text">{children}</span>
      {count !== undefined && (
        <span className="filter-button__count" aria-label={`${count} results`}>
          {count}
        </span>
      )}
    </button>
  );
};
