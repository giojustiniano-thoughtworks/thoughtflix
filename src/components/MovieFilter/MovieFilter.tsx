import React, { useRef } from 'react';
import { type MovieFilterProps } from '../../types/movie.types';
import { GenreFilter } from '../GenreFilter';
import { LanguageFilter } from '../LanguageFilter';
import { YearFilter } from '../YearFilter';
import { SortFilter } from '../SortFilter';
import { FilterButton } from '../FilterButton';
import { FilterDropdown } from '../FilterDropdown';
import { FilterSection } from '../FilterSection';
import { getFilterCount } from '../../utils/filterUtils';
import './MovieFilter.css';

export const MovieFilter: React.FC<MovieFilterProps> = ({
  isOpen,
  onToggle,
  filters,
  availableOptions,
  onFiltersChange,
  onClearFilters,
  onApplyFilters,
  resultCount,
}) => {
  const filterRef = useRef<HTMLDivElement>(null);

  // Note: Click outside and escape key handling is done by FilterDropdown component

  const handleGenreToggle = (genreId: number) => {
    const newSelectedGenres = filters.selectedGenres.includes(genreId)
      ? filters.selectedGenres.filter(id => id !== genreId)
      : [...filters.selectedGenres, genreId];

    onFiltersChange?.({
      ...filters,
      selectedGenres: newSelectedGenres,
    });
  };

  const handleLanguageToggle = (languageCode: string) => {
    const newSelectedLanguages = filters.selectedLanguages.includes(languageCode)
      ? filters.selectedLanguages.filter(code => code !== languageCode)
      : [...filters.selectedLanguages, languageCode];

    onFiltersChange?.({
      ...filters,
      selectedLanguages: newSelectedLanguages,
    });
  };

  const handleYearToggle = (year: number) => {
    const newSelectedYears = filters.selectedReleaseYears.includes(year)
      ? filters.selectedReleaseYears.filter(y => y !== year)
      : [...filters.selectedReleaseYears, year];

    onFiltersChange?.({
      ...filters,
      selectedReleaseYears: newSelectedYears,
    });
  };

  const handleSortChange = (sortBy: MovieFilterProps['filters']['sortBy']) => {
    onFiltersChange?.({
      ...filters,
      sortBy,
    });
  };

  const handleOrderChange = (sortOrder: MovieFilterProps['filters']['sortOrder']) => {
    onFiltersChange?.({
      ...filters,
      sortOrder,
    });
  };

  const handleGenreSelectAll = () => {
    const allGenreIds = availableOptions.genres.map(genre => genre.id);
    onFiltersChange?.({
      ...filters,
      selectedGenres: allGenreIds,
    });
  };

  const handleGenreClearAll = () => {
    onFiltersChange?.({
      ...filters,
      selectedGenres: [],
    });
  };

  const handleLanguageSelectAll = () => {
    const allLanguageCodes = availableOptions.languages.map(language => language.code);
    onFiltersChange?.({
      ...filters,
      selectedLanguages: allLanguageCodes,
    });
  };

  const handleLanguageClearAll = () => {
    onFiltersChange?.({
      ...filters,
      selectedLanguages: [],
    });
  };

  const handleYearSelectAll = () => {
    onFiltersChange?.({
      ...filters,
      selectedReleaseYears: availableOptions.releaseYears,
    });
  };

  const handleYearClearAll = () => {
    onFiltersChange?.({
      ...filters,
      selectedReleaseYears: [],
    });
  };

  const handleClearAllFilters = () => {
    onClearFilters?.();
  };

  const handleApplyFilters = () => {
    onApplyFilters?.();
  };

  const activeFilterCount = getFilterCount(filters);
  const formattedResultCount = resultCount.toLocaleString();

  if (!isOpen) {
    return null;
  }

  return (
    <FilterDropdown
      isOpen={isOpen}
      onClose={onToggle}
      title="Filter Movies"
    >
      <div className="movie-filter" ref={filterRef}>
        <div className="movie-filter__header">
          <h3 className="movie-filter__title">Filter Movies</h3>
          <div className="movie-filter__actions">
            <FilterButton
              isActive={activeFilterCount > 0}
              onClick={handleClearAllFilters}
              count={activeFilterCount}
            >
              Clear All
            </FilterButton>
            <FilterButton
              isActive={false}
              onClick={handleApplyFilters}
            >
              Apply Filters
            </FilterButton>
          </div>
        </div>

        <div className="movie-filter__content">
          <div className="movie-filter__sections">
            <FilterSection
              title="Genres"
              onClearAll={handleGenreClearAll}
              hasSelection={filters.selectedGenres.length > 0}
            >
              <GenreFilter
                genres={availableOptions.genres}
                selectedGenres={filters.selectedGenres}
                onGenreToggle={handleGenreToggle}
                onSelectAll={handleGenreSelectAll}
                onClearAll={handleGenreClearAll}
              />
            </FilterSection>

            <FilterSection
              title="Languages"
              onClearAll={handleLanguageClearAll}
              hasSelection={filters.selectedLanguages.length > 0}
            >
              <LanguageFilter
                languages={availableOptions.languages}
                selectedLanguages={filters.selectedLanguages}
                onLanguageToggle={handleLanguageToggle}
                onSelectAll={handleLanguageSelectAll}
                onClearAll={handleLanguageClearAll}
              />
            </FilterSection>

            <FilterSection
              title="Release Year"
              onClearAll={handleYearClearAll}
              hasSelection={filters.selectedReleaseYears.length > 0}
            >
              <YearFilter
                years={availableOptions.releaseYears}
                selectedYears={filters.selectedReleaseYears}
                onYearToggle={handleYearToggle}
                onSelectAll={handleYearSelectAll}
                onClearAll={handleYearClearAll}
              />
            </FilterSection>

            <FilterSection title="Sort & Order">
              <SortFilter
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={handleSortChange}
                onOrderChange={handleOrderChange}
              />
            </FilterSection>
          </div>

          <div className="movie-filter__footer">
            <div className="movie-filter__result-count">
              {formattedResultCount} results
            </div>
            <div className="movie-filter__footer-actions">
              <FilterButton
                isActive={false}
                onClick={handleClearAllFilters}
              >
                Clear All
              </FilterButton>
              <FilterButton
                isActive={true}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </FilterButton>
            </div>
          </div>
        </div>
      </div>
    </FilterDropdown>
  );
};
