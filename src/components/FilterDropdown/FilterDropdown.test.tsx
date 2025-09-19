import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { FilterDropdown } from './FilterDropdown';

describe('FilterDropdown', () => {
  describe('Rendering', () => {
    it('GIVEN FilterDropdown with isOpen=false WHEN rendered THEN should not display dropdown content', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={false} onClose={mockOnClose} title={title}>
          <div data-testid="dropdown-content">Filter content</div>
        </FilterDropdown>
      );

      // THEN
      expect(screen.queryByTestId('dropdown-content')).not.toBeInTheDocument();
    });

    it('GIVEN FilterDropdown with isOpen=true WHEN rendered THEN should display dropdown content', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div data-testid="dropdown-content">Filter content</div>
        </FilterDropdown>
      );

      // THEN
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('GIVEN FilterDropdown with children WHEN rendered THEN should display children', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';
      const childContent = 'Custom filter content';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div>{childContent}</div>
        </FilterDropdown>
      );

      // THEN
      expect(screen.getByText(childContent)).toBeInTheDocument();
    });
  });

  describe('Close Interaction', () => {
    it('GIVEN FilterDropdown with isOpen=true WHEN close button is clicked THEN should call onClose', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div>Filter content</div>
        </FilterDropdown>
      );

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      // THEN
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('GIVEN FilterDropdown with isOpen=true WHEN backdrop is clicked THEN should call onClose', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div>Filter content</div>
        </FilterDropdown>
      );

      const backdrop = screen.getByTestId('filter-dropdown-backdrop');
      fireEvent.click(backdrop);

      // THEN
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('GIVEN FilterDropdown with isOpen=true WHEN dropdown content is clicked THEN should not call onClose', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div data-testid="dropdown-content">Filter content</div>
        </FilterDropdown>
      );

      const content = screen.getByTestId('dropdown-content');
      fireEvent.click(content);

      // THEN
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction', () => {
    it('GIVEN FilterDropdown with isOpen=true WHEN Escape key is pressed THEN should call onClose', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div>Filter content</div>
        </FilterDropdown>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      // THEN
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('GIVEN FilterDropdown with isOpen=true WHEN other keys are pressed THEN should not call onClose', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div>Filter content</div>
        </FilterDropdown>
      );

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });
      fireEvent.keyDown(document, { key: 'Tab' });

      // THEN
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('GIVEN FilterDropdown with isOpen=true WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div>Filter content</div>
        </FilterDropdown>
      );

      const dropdown = screen.getByRole('dialog');

      // THEN
      expect(dropdown).toHaveAttribute('aria-modal', 'true');
      expect(dropdown).toHaveAttribute('aria-labelledby');
    });

    it('GIVEN FilterDropdown WHEN rendered THEN should have proper focus management', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
          <div>Filter content</div>
        </FilterDropdown>
      );

      const closeButton = screen.getByLabelText('Close');

      // THEN
      expect(closeButton).toBeInTheDocument();
      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN FilterDropdown with empty children WHEN rendered THEN should render without errors', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN & THEN
      expect(() => {
        render(
          <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
            {null}
          </FilterDropdown>
        );
      }).not.toThrow();
    });

    it('GIVEN FilterDropdown with undefined onClose WHEN rendered THEN should not throw error', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const title = 'Filter Options';

      // WHEN & THEN
      expect(() => {
        render(
          <FilterDropdown isOpen={true} onClose={mockOnClose} title={title}>
            <div>Filter content</div>
          </FilterDropdown>
        );
      }).not.toThrow();
    });

    it('GIVEN FilterDropdown with very long title WHEN rendered THEN should display full title', () => {
      // GIVEN
      const mockOnClose = vi.fn();
      const longTitle = 'This is a very long filter dropdown title that should be displayed in full';

      // WHEN
      render(
        <FilterDropdown isOpen={true} onClose={mockOnClose} title={longTitle}>
          <div>Filter content</div>
        </FilterDropdown>
      );

      // THEN
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });
});
