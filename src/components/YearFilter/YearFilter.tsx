import React from 'react';
import { type YearFilterProps } from '../../types/movie.types';
import './YearFilter.css';

export const YearFilter: React.FC<YearFilterProps> = ({
  years,
  selectedYears,
  onYearToggle,
  onSelectAll,
  onClearAll,
}) => {
  const handleYearClick = (year: number) => {
    onYearToggle?.(year);
  };

  const handleSelectAll = () => {
    onSelectAll?.();
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  const isYearSelected = (year: number) => {
    return selectedYears.includes(year);
  };

  return (
    <div className="year-filter">
      <div className="year-filter__header">
        <h4 className="year-filter__title">Release Year</h4>
        <div className="year-filter__actions">
          <button
            type="button"
            className="year-filter__action"
            onClick={handleSelectAll}
            aria-label="Select all years"
          >
            Select All
          </button>
          <button
            type="button"
            className="year-filter__action"
            onClick={handleClearAll}
            aria-label="Clear all year selections"
          >
            Clear All
          </button>
        </div>
      </div>

      {years.length === 0 ? (
        <div className="year-filter__empty">
          <p>No years available</p>
        </div>
      ) : (
        <ul className="year-filter__list" role="list" aria-label="Select release years">
          {years.map((year) => {
            const isSelected = isYearSelected(year);

            return (
              <li key={year} className="year-filter__item">
                <button
                  type="button"
                  className={`year-filter__item-button ${isSelected ? 'year-filter__item--active' : ''}`}
                  onClick={() => handleYearClick(year)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleYearClick(year);
                    }
                  }}
                  aria-label={`Select ${year} year`}
                  aria-pressed={isSelected}
                >
                  <span className="year-filter__item-text">{year}</span>
                  {isSelected && (
                    <span className="year-filter__item-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
