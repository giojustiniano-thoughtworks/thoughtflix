import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MovieFilter } from './MovieFilter';
import { type MovieFilterOptions, type MovieFilters } from '../../types/movie.types';

describe('MovieFilter', () => {
  const mockFilterOptions: MovieFilterOptions = {
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
    ],
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
    ],
    releaseYears: [2020, 2021, 2022, 2023, 2024],
  };

  const mockFilters: MovieFilters = {
    selectedGenres: [],
    selectedLanguages: [],
    selectedReleaseYears: [],
    sortBy: 'popularity',
    sortOrder: 'desc',
  };

  const mockOnFiltersChange = vi.fn();
  const mockOnClearFilters = vi.fn();
  const mockOnApplyFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('GIVEN MovieFilter WHEN rendered THEN should display all filter sections', () => {
      // GIVEN
      const isOpen = true;

      // WHEN
      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      // THEN
      expect(screen.getAllByText('Genres')).toHaveLength(2); // FilterSection + GenreFilter
      expect(screen.getAllByText('Languages')).toHaveLength(2); // FilterSection + LanguageFilter
      expect(screen.getAllByText('Release Year')).toHaveLength(2); // FilterSection + YearFilter
      expect(screen.getByText('Sort By')).toBeInTheDocument();
      expect(screen.getByText('Order')).toBeInTheDocument();
    });

    it('GIVEN MovieFilter WHEN isOpen is false THEN should not be visible', () => {
      // GIVEN
      const isOpen = false;

      // WHEN
      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      // THEN
      expect(screen.queryByText('Genres')).not.toBeInTheDocument();
      expect(screen.queryByText('Languages')).not.toBeInTheDocument();
    });

    it('GIVEN MovieFilter WHEN rendered THEN should display result count', () => {
      // GIVEN
      const isOpen = true;
      const resultCount = 42;

      // WHEN
      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={resultCount}
        />
      );

      // THEN
      expect(screen.getByText('42 results')).toBeInTheDocument();
    });
  });

  describe('Filter Interactions', () => {
    it('GIVEN MovieFilter WHEN genre is selected THEN should call onFiltersChange', () => {
      // GIVEN
      const isOpen = true;

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      const actionButton = screen.getByLabelText('Select Action genre');

      // WHEN
      fireEvent.click(actionButton);

      // THEN
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        selectedGenres: [28],
      });
    });

    it('GIVEN MovieFilter WHEN language is selected THEN should call onFiltersChange', () => {
      // GIVEN
      const isOpen = true;

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      const englishButton = screen.getByLabelText('Select English language');

      // WHEN
      fireEvent.click(englishButton);

      // THEN
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        selectedLanguages: ['en'],
      });
    });

    it('GIVEN MovieFilter WHEN year is selected THEN should call onFiltersChange', () => {
      // GIVEN
      const isOpen = true;

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      const year2021Button = screen.getByLabelText('Select 2021 year');

      // WHEN
      fireEvent.click(year2021Button);

      // THEN
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        selectedReleaseYears: [2021],
      });
    });

    it('GIVEN MovieFilter WHEN sort option is changed THEN should call onFiltersChange', () => {
      // GIVEN
      const isOpen = true;

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      const releaseDateButton = screen.getByLabelText('Sort by release date');

      // WHEN
      fireEvent.click(releaseDateButton);

      // THEN
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        sortBy: 'release_date',
      });
    });

    it('GIVEN MovieFilter WHEN sort order is changed THEN should call onFiltersChange', () => {
      // GIVEN
      const isOpen = true;

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      const ascendingButton = screen.getByLabelText('Sort in ascending order');

      // WHEN
      fireEvent.click(ascendingButton);

      // THEN
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        sortOrder: 'asc',
      });
    });
  });

  describe('Clear Filters', () => {
    it('GIVEN MovieFilter WHEN Clear All button is clicked THEN should call onClearFilters', () => {
      // GIVEN
      const isOpen = true;

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      const clearAllButtons = screen.getAllByRole('button', { name: /clear all/i });
      const clearAllButton = clearAllButtons[0]; // Get the first Clear All button (main one)

      // WHEN
      fireEvent.click(clearAllButton);

      // THEN
      expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Apply Filters', () => {
    it('GIVEN MovieFilter WHEN Apply Filters button is clicked THEN should call onApplyFilters', () => {
      // GIVEN
      const isOpen = true;

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      const applyButtons = screen.getAllByRole('button', { name: /apply filters/i });
      const applyButton = applyButtons[0]; // Get the first Apply Filters button (main one)

      // WHEN
      fireEvent.click(applyButton);

      // THEN
      expect(mockOnApplyFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('GIVEN MovieFilter WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const isOpen = true;

      // WHEN
      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      // THEN
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /clear all/i })).toHaveLength(8); // Multiple Clear All buttons
      expect(screen.getAllByRole('button', { name: /apply filters/i })).toHaveLength(2); // Two Apply Filters buttons
    });

    it('GIVEN MovieFilter WHEN escape key is pressed THEN should call onToggle', () => {
      // GIVEN
      const isOpen = true;
      const mockOnToggle = vi.fn();

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={mockOnToggle}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      // WHEN
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      // THEN
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('GIVEN MovieFilter WHEN close button is clicked THEN should call onToggle', () => {
      // GIVEN
      const isOpen = true;
      const mockOnToggle = vi.fn();

      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={mockOnToggle}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      const closeButton = screen.getByLabelText('Close');

      // WHEN
      fireEvent.click(closeButton);

      // THEN
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN MovieFilter with undefined handlers WHEN rendered THEN should not throw error', () => {
      // GIVEN
      const isOpen = true;

      // WHEN & THEN
      expect(() => {
        render(
          <MovieFilter
            isOpen={isOpen}
            onToggle={vi.fn()}
            filters={mockFilters}
            availableOptions={mockFilterOptions}
            resultCount={0}
          />
        );
      }).not.toThrow();
    });

    it('GIVEN MovieFilter with empty available options WHEN rendered THEN should display empty states', () => {
      // GIVEN
      const isOpen = true;
      const emptyOptions: MovieFilterOptions = {
        genres: [],
        languages: [],
        releaseYears: [],
      };

      // WHEN
      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={emptyOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={0}
        />
      );

      // THEN
      expect(screen.getByText('No genres available')).toBeInTheDocument();
      expect(screen.getByText('No languages available')).toBeInTheDocument();
      expect(screen.getByText('No years available')).toBeInTheDocument();
    });

    it('GIVEN MovieFilter with large result count WHEN rendered THEN should display formatted count', () => {
      // GIVEN
      const isOpen = true;
      const resultCount = 1234;

      // WHEN
      render(
        <MovieFilter
          isOpen={isOpen}
          onToggle={vi.fn()}
          filters={mockFilters}
          availableOptions={mockFilterOptions}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={mockOnClearFilters}
          onApplyFilters={mockOnApplyFilters}
          resultCount={resultCount}
        />
      );

      // THEN
      expect(screen.getByText('1,234 results')).toBeInTheDocument();
    });
  });
});
