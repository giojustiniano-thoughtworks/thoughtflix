import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import './SearchBar.css';

export interface SearchBarProps {
  /** Callback function called when search is performed */
  readonly onSearch: (query: string) => void;
  /** Callback function called when search is cleared */
  readonly onClear?: () => void;
  /** Callback function called when input is focused */
  readonly onFocus?: () => void;
  /** Callback function called when input loses focus */
  readonly onBlur?: () => void;
  /** Initial value for the search input */
  readonly value?: string;
  /** Placeholder text for the input */
  readonly placeholder?: string;
  /** Whether the search bar is disabled */
  readonly disabled?: boolean;
  /** Whether the search bar is in loading state */
  readonly loading?: boolean;
  /** Error message to display */
  readonly error?: string;
  /** Whether to show clear button */
  readonly showClearButton?: boolean;
  /** Debounce delay in milliseconds */
  readonly debounceMs?: number;
  /** Custom ARIA label for accessibility */
  readonly ariaLabel?: string;
  /** Additional CSS class name */
  readonly className?: string;
}

// Main SearchBar Component
export const SearchBar: React.FC<SearchBarProps> = React.memo(({
  onSearch,
  onClear,
  onFocus,
  onBlur,
  value: controlledValue,
  placeholder = 'Search for movies...',
  disabled = false,
  loading = false,
  error,
  showClearButton = false,
  debounceMs = 0,
  ariaLabel = 'Search for movies',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const inputValue = isControlled ? controlledValue : internalValue;

  // Event handlers with useCallback for optimization
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      const newValue = event.target.value;
      
      if (!isControlled) {
        setInternalValue(newValue);
      }

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Handle debounced search
      if (debounceMs > 0) {
        debounceTimeoutRef.current = setTimeout(() => {
          onSearch(newValue.trim());
        }, debounceMs);
      } else {
        // If no debounce, call onSearch immediately
        onSearch(newValue.trim());
      }
    },
    [disabled, isControlled, debounceMs, onSearch]
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    
    if (onClear) {
      onClear();
    }

    // Clear any pending debounced search
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Focus input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isControlled, onClear]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  }, [onBlur]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const trimmedQuery = inputValue.trim();
        if (trimmedQuery && !disabled && !loading) {
          onSearch(trimmedQuery);
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleClear();
      }
    },
    [inputValue, disabled, loading, onSearch, handleClear]
  );

  const handleSearch = useCallback(() => {
    const trimmedQuery = inputValue.trim();
    if (trimmedQuery && !disabled && !loading) {
      onSearch(trimmedQuery);
    }
  }, [inputValue, disabled, loading, onSearch]);

  // Update internal value when controlled value changes
  useEffect(() => {
    if (isControlled && controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [isControlled, controlledValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Memoized computed values
  const containerClasses = useMemo(() => [
    'search-bar',
    isFocused ? 'search-bar--focused' : '',
    disabled ? 'search-bar--disabled' : '',
    error ? 'search-bar--error' : '',
    className,
  ].filter(Boolean).join(' '), [isFocused, disabled, error, className]);

  const inputClasses = useMemo(() => [
    'search-bar__input',
    isFocused ? 'search-bar__input--focused' : '',
    error ? 'search-bar__input--error' : '',
    disabled ? 'search-bar__input--disabled' : '',
  ].filter(Boolean).join(' '), [isFocused, error, disabled]);

  const showClear = useMemo(() => 
    showClearButton && inputValue && !disabled, 
    [showClearButton, inputValue, disabled]
  );

  const hasValue = useMemo(() => 
    inputValue.trim().length > 0, 
    [inputValue]
  );

  const isDisabled = disabled || loading || !hasValue;

  return (
    <div className={containerClasses} data-testid="search-bar">
      <div className="search-bar__container">
        <div className="search-bar__input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={ariaLabel}
            className={inputClasses}
            data-testid="search-input"
            tabIndex={disabled ? -1 : 0}
          />
          
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className="search-bar__clear-button"
              aria-label="Clear search"
              data-testid="search-clear-button"
              tabIndex={disabled ? -1 : 0}
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={isDisabled}
          className="search-bar__search-button"
          aria-label="Search"
          data-testid="search-button"
          tabIndex={disabled ? -1 : 0}
        >
          {loading ? (
            <div className="search-bar__loading" data-testid="search-loading">
              <div className="search-bar__spinner"></div>
            </div>
          ) : (
            <span className="search-bar__search-icon">🔍</span>
          )}
        </button>
      </div>

      {error && (
        <div className="search-bar__error" data-testid="search-error">
          {error}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';