import React from 'react';
import { type LanguageFilterProps } from '../../types/movie.types';
import './LanguageFilter.css';

export const LanguageFilter: React.FC<LanguageFilterProps> = ({
  languages,
  selectedLanguages,
  onLanguageToggle,
  onSelectAll,
  onClearAll,
}) => {
  const handleLanguageClick = (languageCode: string) => {
    onLanguageToggle?.(languageCode);
  };

  const handleSelectAll = () => {
    onSelectAll?.();
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  const isLanguageSelected = (languageCode: string) => {
    return selectedLanguages.includes(languageCode);
  };

  return (
    <div className="language-filter">
      <div className="language-filter__header">
        <h4 className="language-filter__title">Languages</h4>
        <div className="language-filter__actions">
          <button
            type="button"
            className="language-filter__action"
            onClick={handleSelectAll}
            aria-label="Select all languages"
          >
            Select All
          </button>
          <button
            type="button"
            className="language-filter__action"
            onClick={handleClearAll}
            aria-label="Clear all language selections"
          >
            Clear All
          </button>
        </div>
      </div>

      {languages.length === 0 ? (
        <div className="language-filter__empty">
          <p>No languages available</p>
        </div>
      ) : (
        <ul className="language-filter__list" role="list" aria-label="Select languages">
          {languages.map((language) => {
            const isSelected = isLanguageSelected(language.code);

            return (
              <li key={language.code} className="language-filter__item">
                <button
                  type="button"
                  className={`language-filter__item-button ${isSelected ? 'language-filter__item--active' : ''}`}
                  onClick={() => handleLanguageClick(language.code)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLanguageClick(language.code);
                    }
                  }}
                  aria-label={`Select ${language.name} language`}
                  aria-pressed={isSelected}
                >
                  <span className="language-filter__item-text">{language.name}</span>
                  {isSelected && (
                    <span className="language-filter__item-check" aria-hidden="true">
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
