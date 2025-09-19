import React from 'react';
import { type SortFilterProps } from '../../types/movie.types';
import './SortFilter.css';

export const SortFilter: React.FC<SortFilterProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  onOrderChange,
}) => {
  const handleSortChange = (newSortBy: SortFilterProps['sortBy']) => {
    onSortChange?.(newSortBy);
  };

  const handleOrderChange = (newSortOrder: SortFilterProps['sortOrder']) => {
    onOrderChange?.(newSortOrder);
  };

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'vote_average', label: 'Rating' },
    { value: 'title', label: 'Title' },
  ] as const;

  const orderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ] as const;

  return (
    <div className="sort-filter">
      <div className="sort-filter__section">
        <h4 className="sort-filter__title">Sort By</h4>
        <ul className="sort-filter__list" role="list" aria-label="Sort by options">
          {sortOptions.map((option) => {
            const isSelected = sortBy === option.value;
            const buttonClass = `sort-filter__item-button ${isSelected ? 'sort-filter__item--active' : ''}`;

            return (
              <li key={option.value} className="sort-filter__item">
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => handleSortChange(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSortChange(option.value);
                    }
                  }}
                  aria-label={`Sort by ${option.label.toLowerCase()}`}
                  aria-pressed={isSelected}
                >
                  <span className="sort-filter__item-text">{option.label}</span>
                  {isSelected && (
                    <span className="sort-filter__item-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sort-filter__section">
        <h4 className="sort-filter__title">Order</h4>
        <ul className="sort-filter__list" role="list" aria-label="Sort order options">
          {orderOptions.map((option) => {
            const isSelected = sortOrder === option.value;
            const buttonClass = `sort-filter__item-button ${isSelected ? 'sort-filter__item--active' : ''}`;

            return (
              <li key={option.value} className="sort-filter__item">
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => handleOrderChange(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOrderChange(option.value);
                    }
                  }}
                  aria-label={`Sort in ${option.label.toLowerCase()} order`}
                  aria-pressed={isSelected}
                >
                  <span className="sort-filter__item-text">{option.label}</span>
                  {isSelected && (
                    <span className="sort-filter__item-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
