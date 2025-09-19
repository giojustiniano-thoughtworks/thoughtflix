import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { YearFilter } from './YearFilter';

describe('YearFilter', () => {
  const mockYears: number[] = [2020, 2021, 2022, 2023, 2024];

  const mockOnYearToggle = vi.fn();
  const mockOnSelectAll = vi.fn();
  const mockOnClearAll = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('GIVEN YearFilter with years WHEN rendered THEN should display all years', () => {
      // GIVEN
      const selectedYears: number[] = [];

      // WHEN
      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('Release Year')).toBeInTheDocument();
      expect(screen.getByText('2020')).toBeInTheDocument();
      expect(screen.getByText('2021')).toBeInTheDocument();
      expect(screen.getByText('2022')).toBeInTheDocument();
      expect(screen.getByText('2023')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('GIVEN YearFilter with selected years WHEN rendered THEN should show selected years as active', () => {
      // GIVEN
      const selectedYears: number[] = [2021, 2023];

      // WHEN
      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      const year2021Button = screen.getByLabelText('Select 2021 year');
      const year2023Button = screen.getByLabelText('Select 2023 year');
      const year2020Button = screen.getByLabelText('Select 2020 year');

      expect(year2021Button).toHaveClass('year-filter__item--active');
      expect(year2023Button).toHaveClass('year-filter__item--active');
      expect(year2020Button).not.toHaveClass('year-filter__item--active');
    });

    it('GIVEN YearFilter with empty years array WHEN rendered THEN should display no years', () => {
      // GIVEN
      const selectedYears: number[] = [];

      // WHEN
      render(
        <YearFilter
          years={[]}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('Release Year')).toBeInTheDocument();
      expect(screen.queryByText('2020')).not.toBeInTheDocument();
      expect(screen.queryByText('2021')).not.toBeInTheDocument();
    });
  });

  describe('Year Selection', () => {
    it('GIVEN YearFilter WHEN year button is clicked THEN should call onYearToggle with year', () => {
      // GIVEN
      const selectedYears: number[] = [];

      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const year2021Button = screen.getByLabelText('Select 2021 year');

      // WHEN
      fireEvent.click(year2021Button);

      // THEN
      expect(mockOnYearToggle).toHaveBeenCalledTimes(1);
      expect(mockOnYearToggle).toHaveBeenCalledWith(2021);
    });

    it('GIVEN YearFilter WHEN multiple year buttons are clicked THEN should call onYearToggle for each', () => {
      // GIVEN
      const selectedYears: number[] = [];

      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const year2020Button = screen.getByLabelText('Select 2020 year');
      const year2022Button = screen.getByLabelText('Select 2022 year');

      // WHEN
      fireEvent.click(year2020Button);
      fireEvent.click(year2022Button);

      // THEN
      expect(mockOnYearToggle).toHaveBeenCalledTimes(2);
      expect(mockOnYearToggle).toHaveBeenNthCalledWith(1, 2020);
      expect(mockOnYearToggle).toHaveBeenNthCalledWith(2, 2022);
    });
  });

  describe('Select All Functionality', () => {
    it('GIVEN YearFilter WHEN Select All button is clicked THEN should call onSelectAll', () => {
      // GIVEN
      const selectedYears: number[] = [];

      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const selectAllButton = screen.getByLabelText('Select all years');

      // WHEN
      fireEvent.click(selectAllButton);

      // THEN
      expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
    });

    it('GIVEN YearFilter with all years selected WHEN Select All button is clicked THEN should still call onSelectAll', () => {
      // GIVEN
      const selectedYears: number[] = [2020, 2021, 2022, 2023, 2024];

      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const selectAllButton = screen.getByLabelText('Select all years');

      // WHEN
      fireEvent.click(selectAllButton);

      // THEN
      expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clear All Functionality', () => {
    it('GIVEN YearFilter WHEN Clear All button is clicked THEN should call onClearAll', () => {
      // GIVEN
      const selectedYears: number[] = [];

      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const clearAllButton = screen.getByLabelText('Clear all year selections');

      // WHEN
      fireEvent.click(clearAllButton);

      // THEN
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });

    it('GIVEN YearFilter with selected years WHEN Clear All button is clicked THEN should call onClearAll', () => {
      // GIVEN
      const selectedYears: number[] = [2021, 2023];

      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const clearAllButton = screen.getByLabelText('Clear all year selections');

      // WHEN
      fireEvent.click(clearAllButton);

      // THEN
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('GIVEN YearFilter WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const selectedYears: number[] = [];

      // WHEN
      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Select release years');
      expect(screen.getByLabelText('Select 2020 year')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByLabelText('Select 2021 year')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByLabelText('Select all years')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear all year selections')).toBeInTheDocument();
    });

    it('GIVEN YearFilter WHEN year button is focused THEN should be focusable', () => {
      // GIVEN
      const selectedYears: number[] = [];

      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const year2021Button = screen.getByLabelText('Select 2021 year');
      year2021Button.focus();

      // THEN
      expect(year2021Button).toHaveFocus();
    });

    it('GIVEN YearFilter WHEN year button is pressed with keyboard THEN should call onYearToggle', () => {
      // GIVEN
      const selectedYears: number[] = [];

      render(
        <YearFilter
          years={mockYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const year2021Button = screen.getByLabelText('Select 2021 year');

      // WHEN
      year2021Button.focus();
      fireEvent.keyDown(year2021Button, { key: 'Enter', code: 'Enter' });

      // THEN
      expect(mockOnYearToggle).toHaveBeenCalledTimes(1);
      expect(mockOnYearToggle).toHaveBeenCalledWith(2021);
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN YearFilter with undefined handlers WHEN rendered THEN should not throw error', () => {
      // GIVEN
      const selectedYears: number[] = [];

      // WHEN & THEN
      expect(() => {
        render(
          <YearFilter
            years={mockYears}
            selectedYears={selectedYears}
          />
        );
      }).not.toThrow();
    });

    it('GIVEN YearFilter with very old years WHEN rendered THEN should display correctly', () => {
      // GIVEN
      const oldYears: number[] = [1990, 1995, 2000, 2005];
      const selectedYears: number[] = [];

      // WHEN
      render(
        <YearFilter
          years={oldYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('1990')).toBeInTheDocument();
      expect(screen.getByText('1995')).toBeInTheDocument();
      expect(screen.getByText('2000')).toBeInTheDocument();
      expect(screen.getByText('2005')).toBeInTheDocument();
    });

    it('GIVEN YearFilter with future years WHEN rendered THEN should display correctly', () => {
      // GIVEN
      const futureYears: number[] = [2025, 2030, 2035, 2040];
      const selectedYears: number[] = [];

      // WHEN
      render(
        <YearFilter
          years={futureYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('2025')).toBeInTheDocument();
      expect(screen.getByText('2030')).toBeInTheDocument();
      expect(screen.getByText('2035')).toBeInTheDocument();
      expect(screen.getByText('2040')).toBeInTheDocument();
    });

    it('GIVEN YearFilter with duplicate years WHEN rendered THEN should handle gracefully', () => {
      // GIVEN
      const duplicateYears: number[] = [2020, 2020, 2021, 2021];
      const selectedYears: number[] = [];

      // WHEN
      render(
        <YearFilter
          years={duplicateYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getAllByText('2020')).toHaveLength(2);
      expect(screen.getAllByText('2021')).toHaveLength(2);
    });

    it('GIVEN YearFilter with negative years WHEN rendered THEN should display correctly', () => {
      // GIVEN
      const negativeYears: number[] = [-100, -50, 0, 50];
      const selectedYears: number[] = [];

      // WHEN
      render(
        <YearFilter
          years={negativeYears}
          selectedYears={selectedYears}
          onYearToggle={mockOnYearToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('-100')).toBeInTheDocument();
      expect(screen.getByText('-50')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });
});
