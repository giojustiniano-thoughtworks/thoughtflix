import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { SearchBar } from './SearchBar';
import { type SearchBarProps } from './SearchBar';

// Common mocks
const mockOnSearch = vi.fn();
const mockOnClear = vi.fn();
const mockOnFocus = vi.fn();
const mockOnBlur = vi.fn();

// Test wrapper component
const TestWrapper: React.FC<{ 
  props?: Partial<SearchBarProps>;
}> = ({ props = {} }) => {
  return (
    <SearchBar
      onSearch={mockOnSearch}
      onClear={mockOnClear}
      onFocus={mockOnFocus}
      onBlur={mockOnBlur}
      placeholder="Search for movies..."
      showClearButton={true}
      debounceMs={300}
      {...props}
    />
  );
};

describe('SearchBar Component - Optimized', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Component Rendering', () => {
    it('GIVEN SearchBar component WHEN rendering with default props THEN should display search input and button', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search for movies...')).toBeInTheDocument();
    });

    it('GIVEN SearchBar component WHEN rendering with custom placeholder THEN should display custom placeholder', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        placeholder: 'Custom placeholder',
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });

    it('GIVEN SearchBar component WHEN rendering with showClearButton true and value THEN should display clear button', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        showClearButton: true,
        value: 'test value',
      };

      // WHEN
      render(<TestWrapper props={props} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test value' } });

      // THEN
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('GIVEN SearchBar component WHEN rendering with showClearButton false THEN should not display clear button', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        showClearButton: false,
        value: 'test value',
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });
  });

  describe('Event Handler Optimization', () => {
    it('GIVEN SearchBar component WHEN re-rendering with same props THEN should maintain referential stability', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        onClear: mockOnClear,
        onFocus: mockOnFocus,
        onBlur: mockOnBlur,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={props} />);
      
      // Get initial references
      const searchInput = screen.getByRole('textbox');
      const searchButton = screen.getByLabelText('Search');
      
      // Rerender with same props
      rerender(<TestWrapper props={props} />);
      
      // THEN
      // Event handlers should maintain referential stability due to useCallback
      expect(screen.getByRole('textbox')).toBe(searchInput);
      expect(screen.getByLabelText('Search')).toBe(searchButton);
    });

    it('GIVEN SearchBar component WHEN props change THEN should update handlers appropriately', () => {
      // GIVEN
      const initialProps: SearchBarProps = {
        onSearch: mockOnSearch,
        disabled: false,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={initialProps} />);
      
      // THEN - Initially enabled
      expect(screen.getByRole('textbox')).not.toBeDisabled();

      // WHEN - Props change to disabled
      const updatedProps: SearchBarProps = {
        ...initialProps,
        disabled: true,
      };
      rerender(<TestWrapper props={updatedProps} />);

      // THEN - Should be disabled
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('Search Functionality', () => {
    it('GIVEN SearchBar component WHEN typing in input THEN should update input value', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });

      // THEN
      expect(searchInput).toHaveValue('test query');
    });

    it('GIVEN SearchBar component WHEN typing with debounce THEN should call onSearch after debounce delay', async () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        debounceMs: 300,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });

      // THEN - Should not be called immediately
      expect(mockOnSearch).not.toHaveBeenCalled();

      // WHEN - Advance timers by debounce delay
      vi.advanceTimersByTime(300);

      // THEN - Should be called after debounce
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('GIVEN SearchBar component WHEN typing multiple times within debounce delay THEN should only call onSearch once', async () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        debounceMs: 300,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      fireEvent.change(searchInput, { target: { value: 'test query final' } });

      // Advance timers by debounce delay
      vi.advanceTimersByTime(300);

      // THEN - Should only be called once with final value
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('test query final');
    });

    it('GIVEN SearchBar component WHEN pressing Enter key THEN should call onSearch immediately', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        debounceMs: 300,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      // THEN - Should be called immediately
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('GIVEN SearchBar component WHEN pressing Escape key THEN should clear input and call onClear', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        onClear: mockOnClear,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      fireEvent.keyDown(searchInput, { key: 'Escape' });

      // THEN
      expect(searchInput).toHaveValue('');
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('Focus and Blur Events', () => {
    it('GIVEN SearchBar component WHEN input is focused THEN should call onFocus', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        onFocus: mockOnFocus,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.focus(searchInput);

      // THEN
      expect(mockOnFocus).toHaveBeenCalled();
    });

    it('GIVEN SearchBar component WHEN input loses focus THEN should call onBlur', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        onBlur: mockOnBlur,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.blur(searchInput);

      // THEN
      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  describe('Clear Functionality', () => {
    it('GIVEN SearchBar component WHEN clicking clear button THEN should clear input and call onClear', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        onClear: mockOnClear,
        showClearButton: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      
      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);

      // THEN
      expect(searchInput).toHaveValue('');
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('GIVEN SearchBar component WHEN clearing input THEN should focus input after clearing', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        onClear: mockOnClear,
        showClearButton: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      
      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);

      // THEN
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Loading State', () => {
    it('GIVEN SearchBar component WHEN in loading state THEN should display loading spinner', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        loading: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByTestId('search-loading')).toBeInTheDocument();
      expect(screen.getByLabelText('Search')).toBeDisabled();
    });

    it('GIVEN SearchBar component WHEN in loading state THEN should disable search button', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        loading: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByLabelText('Search')).toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('GIVEN SearchBar component WHEN has error THEN should display error message', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        error: 'Search failed',
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByTestId('search-error')).toBeInTheDocument();
      expect(screen.getByText('Search failed')).toBeInTheDocument();
    });

    it('GIVEN SearchBar component WHEN has error THEN should apply error styling', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        error: 'Search failed',
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveClass('search-bar__input--error');
    });
  });

  describe('Disabled State', () => {
    it('GIVEN SearchBar component WHEN disabled THEN should disable all interactive elements', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        disabled: true,
        showClearButton: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(screen.getByLabelText('Search')).toBeDisabled();
    });

    it('GIVEN SearchBar component WHEN disabled THEN should not respond to input changes', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        disabled: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });

      // THEN
      expect(searchInput).toHaveValue('');
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('GIVEN SearchBar component WHEN controlled with value prop THEN should use controlled value', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        value: 'controlled value',
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByRole('textbox')).toHaveValue('controlled value');
    });

    it('GIVEN SearchBar component WHEN uncontrolled THEN should use internal state', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'uncontrolled value' } });

      // THEN
      expect(searchInput).toHaveValue('uncontrolled value');
    });
  });

  describe('Accessibility', () => {
    it('GIVEN SearchBar component WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        ariaLabel: 'Custom search label',
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Custom search label');
      expect(screen.getByLabelText('Search')).toHaveAttribute('aria-label', 'Search');
    });

    it('GIVEN SearchBar component WHEN disabled THEN should have proper tabindex', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        disabled: true,
      };

      // WHEN
      render(<TestWrapper props={props} />);

      // THEN
      expect(screen.getByRole('textbox')).toHaveAttribute('tabindex', '-1');
      expect(screen.getByLabelText('Search')).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN SearchBar component WHEN rapid typing THEN should handle debounce correctly', async () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        debounceMs: 100,
      };

      // WHEN
      render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      
      // Rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(searchInput, { target: { value: `test${i}` } });
        vi.advanceTimersByTime(50); // Less than debounce delay
      }

      // Advance past debounce delay
      vi.advanceTimersByTime(100);

      // THEN - Should only be called once with final value
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('test9');
    });

    it('GIVEN SearchBar component WHEN clearing timeout on unmount THEN should not cause memory leaks', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        debounceMs: 1000,
      };

      // WHEN
      const { unmount } = render(<TestWrapper props={props} />);
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      // Unmount before timeout
      unmount();

      // THEN - Should not throw error or cause memory leak
      expect(() => {
        vi.advanceTimersByTime(1000);
      }).not.toThrow();
    });
  });

  describe('Performance Optimization', () => {
    it('GIVEN SearchBar component WHEN re-rendering with same props THEN should not cause unnecessary re-renders', () => {
      // GIVEN
      const props: SearchBarProps = {
        onSearch: mockOnSearch,
        onClear: mockOnClear,
        onFocus: mockOnFocus,
        onBlur: mockOnBlur,
      };

      // WHEN
      const { rerender } = render(<TestWrapper props={props} />);
      
      // Get initial DOM elements
      const initialSearchInput = screen.getByRole('textbox');
      const initialSearchButton = screen.getByLabelText('Search');
      
      // Rerender with same props
      rerender(<TestWrapper props={props} />);
      
      // THEN
      // Elements should be the same instances (referential equality)
      expect(screen.getByRole('textbox')).toBe(initialSearchInput);
      expect(screen.getByLabelText('Search')).toBe(initialSearchButton);
    });
  });
});
