import React, { useEffect, useRef } from 'react';
import { type FilterDropdownProps } from '../../types/movie.types';
import './FilterDropdown.css';

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the close button when dropdown opens
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="filter-dropdown-backdrop"
      data-testid="filter-dropdown-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        ref={dropdownRef}
        className="filter-dropdown"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-dropdown-title"
      >
        <div className="filter-dropdown__header">
          <h3 id="filter-dropdown-title" className="filter-dropdown__title">
            {title}
          </h3>
          <button
            ref={closeButtonRef}
            className="filter-dropdown__close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <span className="filter-dropdown__close-icon">×</span>
          </button>
        </div>
        <div className="filter-dropdown__content">
          {children}
        </div>
      </div>
    </div>
  );
};
