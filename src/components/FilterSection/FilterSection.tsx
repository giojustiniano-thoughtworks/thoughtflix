import React from 'react';
import { type FilterSectionProps } from '../../types/movie.types';
import './FilterSection.css';

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  onClearAll,
  hasSelection = false,
}) => {
  const handleClearAll = () => {
    onClearAll?.();
  };

  return (
    <section className="filter-section" role="region" aria-label={title}>
      <div className="filter-section__header">
        <h4 className="filter-section__title">{title}</h4>
        {onClearAll && (
          <button
            type="button"
            className={`filter-section__clear ${hasSelection ? 'filter-section__clear--active' : ''}`}
            onClick={handleClearAll}
            aria-label="Clear all selections"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="filter-section__content">
        {children}
      </div>
    </section>
  );
};
