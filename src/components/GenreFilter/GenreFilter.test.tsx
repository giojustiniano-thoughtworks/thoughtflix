import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { GenreFilter } from './GenreFilter';
import { type Genre } from '../../types/movie.types';

describe('GenreFilter', () => {
  const mockGenres: Genre[] = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Horror' },
    { id: 5, name: 'Romance' },
  ];

  describe('Rendering', () => {
    it('GIVEN GenreFilter with genres WHEN rendered THEN should display all genres', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Comedy')).toBeInTheDocument();
      expect(screen.getByText('Drama')).toBeInTheDocument();
      expect(screen.getByText('Horror')).toBeInTheDocument();
      expect(screen.getByText('Romance')).toBeInTheDocument();
    });

    it('GIVEN GenreFilter with selected genres WHEN rendered THEN should show selected genres as active', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres = [1, 3]; // Action and Drama

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      const actionButton = screen.getByText('Action').closest('button');
      const dramaButton = screen.getByText('Drama').closest('button');
      const comedyButton = screen.getByText('Comedy').closest('button');

      expect(actionButton).toHaveClass('genre-filter__item--active');
      expect(dramaButton).toHaveClass('genre-filter__item--active');
      expect(comedyButton).not.toHaveClass('genre-filter__item--active');
    });

    it('GIVEN GenreFilter with empty genres array WHEN rendered THEN should display no genres', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={[]}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.queryByText('Action')).not.toBeInTheDocument();
      expect(screen.getByText('No genres available')).toBeInTheDocument();
    });
  });

  describe('Genre Selection', () => {
    it('GIVEN GenreFilter WHEN genre button is clicked THEN should call onGenreToggle with genre ID', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const actionButton = screen.getByText('Action');
      fireEvent.click(actionButton);

      // THEN
      expect(mockOnGenreToggle).toHaveBeenCalledTimes(1);
      expect(mockOnGenreToggle).toHaveBeenCalledWith(1);
    });

    it('GIVEN GenreFilter WHEN multiple genre buttons are clicked THEN should call onGenreToggle for each', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      fireEvent.click(screen.getByText('Action'));
      fireEvent.click(screen.getByText('Comedy'));
      fireEvent.click(screen.getByText('Drama'));

      // THEN
      expect(mockOnGenreToggle).toHaveBeenCalledTimes(3);
      expect(mockOnGenreToggle).toHaveBeenNthCalledWith(1, 1);
      expect(mockOnGenreToggle).toHaveBeenNthCalledWith(2, 2);
      expect(mockOnGenreToggle).toHaveBeenNthCalledWith(3, 3);
    });
  });

  describe('Select All Functionality', () => {
    it('GIVEN GenreFilter WHEN Select All button is clicked THEN should call onSelectAll', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const selectAllButton = screen.getByText('Select All');
      fireEvent.click(selectAllButton);

      // THEN
      expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
    });

    it('GIVEN GenreFilter with all genres selected WHEN Select All button is clicked THEN should still call onSelectAll', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres = [1, 2, 3, 4, 5]; // All genres selected

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const selectAllButton = screen.getByText('Select All');
      fireEvent.click(selectAllButton);

      // THEN
      expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clear All Functionality', () => {
    it('GIVEN GenreFilter WHEN Clear All button is clicked THEN should call onClearAll', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const clearAllButton = screen.getByText('Clear All');
      fireEvent.click(clearAllButton);

      // THEN
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });

    it('GIVEN GenreFilter with selected genres WHEN Clear All button is clicked THEN should call onClearAll', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres = [1, 2, 3]; // Some genres selected

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const clearAllButton = screen.getByText('Clear All');
      fireEvent.click(clearAllButton);

      // THEN
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('GIVEN GenreFilter WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      const genreList = screen.getByRole('list');
      expect(genreList).toHaveAttribute('aria-label', 'Select genres');
      
      const genreButtons = screen.getAllByRole('listitem');
      expect(genreButtons).toHaveLength(mockGenres.length);
    });

    it('GIVEN GenreFilter WHEN genre button is focused THEN should be focusable', () => {
      // GIVEN
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={mockGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const actionButton = screen.getByLabelText('Select Action genre');
      actionButton.focus();

      // THEN
      expect(actionButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN GenreFilter with undefined handlers WHEN rendered THEN should not throw error', () => {
      // GIVEN
      const selectedGenres: number[] = [];

      // WHEN & THEN
      expect(() => {
        render(
          <GenreFilter
            genres={mockGenres}
            selectedGenres={selectedGenres}
          />
        );
      }).not.toThrow();
    });

    it('GIVEN GenreFilter with very long genre names WHEN rendered THEN should display full names', () => {
      // GIVEN
      const longGenres: Genre[] = [
        { id: 1, name: 'Very Long Genre Name That Should Be Displayed In Full' },
        { id: 2, name: 'Another Extremely Long Genre Name That Tests Layout' },
      ];
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={longGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('Very Long Genre Name That Should Be Displayed In Full')).toBeInTheDocument();
      expect(screen.getByText('Another Extremely Long Genre Name That Tests Layout')).toBeInTheDocument();
    });

    it('GIVEN GenreFilter with duplicate genre IDs WHEN rendered THEN should handle gracefully', () => {
      // GIVEN
      const duplicateGenres: Genre[] = [
        { id: 1, name: 'Action' },
        { id: 1, name: 'Action Duplicate' },
        { id: 2, name: 'Comedy' },
      ];
      const mockOnGenreToggle = vi.fn();
      const mockOnSelectAll = vi.fn();
      const mockOnClearAll = vi.fn();
      const selectedGenres: number[] = [];

      // WHEN
      render(
        <GenreFilter
          genres={duplicateGenres}
          selectedGenres={selectedGenres}
          onGenreToggle={mockOnGenreToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Action Duplicate')).toBeInTheDocument();
      expect(screen.getByText('Comedy')).toBeInTheDocument();
    });
  });
});
