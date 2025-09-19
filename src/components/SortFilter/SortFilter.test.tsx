import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SortFilter } from './SortFilter';
import { type MovieFilters } from '../../types/movie.types';

describe('SortFilter', () => {
  const mockOnSortChange = vi.fn();
  const mockOnOrderChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('GIVEN SortFilter WHEN rendered THEN should display sort options', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      // WHEN
      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      // THEN
      expect(screen.getByText('Sort By')).toBeInTheDocument();
      expect(screen.getByText('Order')).toBeInTheDocument();
      expect(screen.getByText('Popularity')).toBeInTheDocument();
      expect(screen.getByText('Release Date')).toBeInTheDocument();
      expect(screen.getByText('Rating')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Ascending')).toBeInTheDocument();
      expect(screen.getByText('Descending')).toBeInTheDocument();
    });

    it('GIVEN SortFilter with popularity sort WHEN rendered THEN should show popularity as selected', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      // WHEN
      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      // THEN
      const popularityButton = screen.getByLabelText('Sort by popularity');
      const releaseDateButton = screen.getByLabelText('Sort by release date');

      expect(popularityButton).toHaveClass('sort-filter__item--active');
      expect(releaseDateButton).not.toHaveClass('sort-filter__item--active');
    });

    it('GIVEN SortFilter with descending order WHEN rendered THEN should show descending as selected', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      // WHEN
      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      // THEN
      const ascendingButton = screen.getByLabelText('Sort in ascending order');
      const descendingButton = screen.getByLabelText('Sort in descending order');

      expect(ascendingButton).not.toHaveClass('sort-filter__item--active');
      expect(descendingButton).toHaveClass('sort-filter__item--active');
    });
  });

  describe('Sort Selection', () => {
    it('GIVEN SortFilter WHEN sort option is clicked THEN should call onSortChange with sort type', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      const releaseDateButton = screen.getByLabelText('Sort by release date');

      // WHEN
      fireEvent.click(releaseDateButton);

      // THEN
      expect(mockOnSortChange).toHaveBeenCalledTimes(1);
      expect(mockOnSortChange).toHaveBeenCalledWith('release_date');
    });

    it('GIVEN SortFilter WHEN multiple sort options are clicked THEN should call onSortChange for each', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      const ratingButton = screen.getByLabelText('Sort by rating');
      const titleButton = screen.getByLabelText('Sort by title');

      // WHEN
      fireEvent.click(ratingButton);
      fireEvent.click(titleButton);

      // THEN
      expect(mockOnSortChange).toHaveBeenCalledTimes(2);
      expect(mockOnSortChange).toHaveBeenNthCalledWith(1, 'vote_average');
      expect(mockOnSortChange).toHaveBeenNthCalledWith(2, 'title');
    });
  });

  describe('Order Selection', () => {
    it('GIVEN SortFilter WHEN order option is clicked THEN should call onOrderChange with order type', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      const ascendingButton = screen.getByLabelText('Sort in ascending order');

      // WHEN
      fireEvent.click(ascendingButton);

      // THEN
      expect(mockOnOrderChange).toHaveBeenCalledTimes(1);
      expect(mockOnOrderChange).toHaveBeenCalledWith('asc');
    });

    it('GIVEN SortFilter WHEN order is changed multiple times THEN should call onOrderChange for each', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      const ascendingButton = screen.getByLabelText('Sort in ascending order');
      const descendingButton = screen.getByLabelText('Sort in descending order');

      // WHEN
      fireEvent.click(ascendingButton);
      fireEvent.click(descendingButton);

      // THEN
      expect(mockOnOrderChange).toHaveBeenCalledTimes(2);
      expect(mockOnOrderChange).toHaveBeenNthCalledWith(1, 'asc');
      expect(mockOnOrderChange).toHaveBeenNthCalledWith(2, 'desc');
    });
  });

  describe('Accessibility', () => {
    it('GIVEN SortFilter WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      // WHEN
      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      // THEN
      expect(screen.getByRole('list', { name: 'Sort by options' })).toBeInTheDocument();
      expect(screen.getByRole('list', { name: 'Sort order options' })).toBeInTheDocument();
      expect(screen.getByLabelText('Sort by popularity')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByLabelText('Sort by release date')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByLabelText('Sort in ascending order')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByLabelText('Sort in descending order')).toHaveAttribute('aria-pressed', 'true');
    });

    it('GIVEN SortFilter WHEN sort button is focused THEN should be focusable', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      const releaseDateButton = screen.getByLabelText('Sort by release date');
      releaseDateButton.focus();

      // THEN
      expect(releaseDateButton).toHaveFocus();
    });

    it('GIVEN SortFilter WHEN sort button is pressed with keyboard THEN should call onSortChange', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      const releaseDateButton = screen.getByLabelText('Sort by release date');

      // WHEN
      releaseDateButton.focus();
      fireEvent.keyDown(releaseDateButton, { key: 'Enter', code: 'Enter' });

      // THEN
      expect(mockOnSortChange).toHaveBeenCalledTimes(1);
      expect(mockOnSortChange).toHaveBeenCalledWith('release_date');
    });

    it('GIVEN SortFilter WHEN order button is pressed with keyboard THEN should call onOrderChange', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      const ascendingButton = screen.getByLabelText('Sort in ascending order');

      // WHEN
      ascendingButton.focus();
      fireEvent.keyDown(ascendingButton, { key: 'Enter', code: 'Enter' });

      // THEN
      expect(mockOnOrderChange).toHaveBeenCalledTimes(1);
      expect(mockOnOrderChange).toHaveBeenCalledWith('asc');
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN SortFilter with undefined handlers WHEN rendered THEN should not throw error', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'popularity';
      const sortOrder: MovieFilters['sortOrder'] = 'desc';

      // WHEN & THEN
      expect(() => {
        render(
          <SortFilter
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        );
      }).not.toThrow();
    });

    it('GIVEN SortFilter with all sort options WHEN rendered THEN should display all options', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'title';
      const sortOrder: MovieFilters['sortOrder'] = 'asc';

      // WHEN
      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      // THEN
      expect(screen.getByText('Popularity')).toBeInTheDocument();
      expect(screen.getByText('Release Date')).toBeInTheDocument();
      expect(screen.getByText('Rating')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Ascending')).toBeInTheDocument();
      expect(screen.getByText('Descending')).toBeInTheDocument();
    });

    it('GIVEN SortFilter with different sort types WHEN rendered THEN should show correct selection', () => {
      // GIVEN
      const sortBy: MovieFilters['sortBy'] = 'vote_average';
      const sortOrder: MovieFilters['sortOrder'] = 'asc';

      // WHEN
      render(
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={mockOnSortChange}
          onOrderChange={mockOnOrderChange}
        />
      );

      // THEN
      const ratingButton = screen.getByLabelText('Sort by rating');
      const ascendingButton = screen.getByLabelText('Sort in ascending order');

      expect(ratingButton).toHaveClass('sort-filter__item--active');
      expect(ascendingButton).toHaveClass('sort-filter__item--active');
    });
  });
});
