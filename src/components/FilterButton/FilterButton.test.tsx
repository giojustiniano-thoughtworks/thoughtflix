import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { FilterButton } from './FilterButton';

describe('FilterButton', () => {
  describe('Rendering', () => {
    it('GIVEN FilterButton with children WHEN rendered THEN should display children', () => {
      // GIVEN
      const mockOnClick = vi.fn();
      const buttonText = 'Filter Movies';

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick}>
          {buttonText}
        </FilterButton>
      );

      // THEN
      expect(screen.getByText(buttonText)).toBeInTheDocument();
    });

    it('GIVEN FilterButton with count WHEN rendered THEN should display count', () => {
      // GIVEN
      const mockOnClick = vi.fn();
      const count = 5;

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick} count={count}>
          Filter Movies
        </FilterButton>
      );

      // THEN
      expect(screen.getByText(count.toString())).toBeInTheDocument();
    });

    it('GIVEN FilterButton without count WHEN rendered THEN should not display count', () => {
      // GIVEN
      const mockOnClick = vi.fn();

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick}>
          Filter Movies
        </FilterButton>
      );

      // THEN
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    it('GIVEN FilterButton with isActive=true WHEN rendered THEN should have active class', () => {
      // GIVEN
      const mockOnClick = vi.fn();

      // WHEN
      render(
        <FilterButton isActive={true} onClick={mockOnClick}>
          Filter Movies
        </FilterButton>
      );

      // THEN
      const button = screen.getByRole('button');
      expect(button).toHaveClass('filter-button--active');
    });

    it('GIVEN FilterButton with isActive=false WHEN rendered THEN should not have active class', () => {
      // GIVEN
      const mockOnClick = vi.fn();

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick}>
          Filter Movies
        </FilterButton>
      );

      // THEN
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('filter-button--active');
    });
  });

  describe('Click Interaction', () => {
    it('GIVEN FilterButton WHEN clicked THEN should call onClick handler', () => {
      // GIVEN
      const mockOnClick = vi.fn();

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick}>
          Filter Movies
        </FilterButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // THEN
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('GIVEN FilterButton WHEN clicked multiple times THEN should call onClick handler multiple times', () => {
      // GIVEN
      const mockOnClick = vi.fn();

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick}>
          Filter Movies
        </FilterButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // THEN
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('GIVEN FilterButton WHEN rendered THEN should be focusable', () => {
      // GIVEN
      const mockOnClick = vi.fn();

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick}>
          Filter Movies
        </FilterButton>
      );

      const button = screen.getByRole('button');

      // THEN
      expect(button).toBeInTheDocument();
      button.focus();
      expect(button).toHaveFocus();
    });

    it('GIVEN FilterButton WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const mockOnClick = vi.fn();

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick}>
          Filter Movies
        </FilterButton>
      );

      const button = screen.getByRole('button');

      // THEN
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN FilterButton with undefined onClick WHEN clicked THEN should not throw error', () => {
      // GIVEN
      const mockOnClick = vi.fn();

      // WHEN & THEN
      expect(() => {
        render(
          <FilterButton isActive={false} onClick={mockOnClick}>
            Filter Movies
          </FilterButton>
        );
      }).not.toThrow();
    });

    it('GIVEN FilterButton with count=0 WHEN rendered THEN should display 0', () => {
      // GIVEN
      const mockOnClick = vi.fn();
      const count = 0;

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick} count={count}>
          Filter Movies
        </FilterButton>
      );

      // THEN
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('GIVEN FilterButton with negative count WHEN rendered THEN should display negative count', () => {
      // GIVEN
      const mockOnClick = vi.fn();
      const count = -5;

      // WHEN
      render(
        <FilterButton isActive={false} onClick={mockOnClick} count={count}>
          Filter Movies
        </FilterButton>
      );

      // THEN
      expect(screen.getByText('-5')).toBeInTheDocument();
    });
  });
});
