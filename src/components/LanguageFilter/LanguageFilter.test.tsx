import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { LanguageFilter } from './LanguageFilter';
import { type Language } from '../../types/movie.types';

describe('LanguageFilter', () => {
  const mockLanguages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
  ];

  const mockOnLanguageToggle = vi.fn();
  const mockOnSelectAll = vi.fn();
  const mockOnClearAll = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('GIVEN LanguageFilter with languages WHEN rendered THEN should display all languages', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      // WHEN
      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('Languages')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Spanish')).toBeInTheDocument();
      expect(screen.getByText('French')).toBeInTheDocument();
      expect(screen.getByText('German')).toBeInTheDocument();
      expect(screen.getByText('Italian')).toBeInTheDocument();
    });

    it('GIVEN LanguageFilter with selected languages WHEN rendered THEN should show selected languages as active', () => {
      // GIVEN
      const selectedLanguages: string[] = ['en', 'fr'];

      // WHEN
      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      const englishButton = screen.getByLabelText('Select English language');
      const frenchButton = screen.getByLabelText('Select French language');
      const spanishButton = screen.getByLabelText('Select Spanish language');

      expect(englishButton).toHaveClass('language-filter__item--active');
      expect(frenchButton).toHaveClass('language-filter__item--active');
      expect(spanishButton).not.toHaveClass('language-filter__item--active');
    });

    it('GIVEN LanguageFilter with empty languages array WHEN rendered THEN should display no languages', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      // WHEN
      render(
        <LanguageFilter
          languages={[]}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('Languages')).toBeInTheDocument();
      expect(screen.queryByText('English')).not.toBeInTheDocument();
      expect(screen.queryByText('Spanish')).not.toBeInTheDocument();
    });
  });

  describe('Language Selection', () => {
    it('GIVEN LanguageFilter WHEN language button is clicked THEN should call onLanguageToggle with language code', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const englishButton = screen.getByLabelText('Select English language');

      // WHEN
      fireEvent.click(englishButton);

      // THEN
      expect(mockOnLanguageToggle).toHaveBeenCalledTimes(1);
      expect(mockOnLanguageToggle).toHaveBeenCalledWith('en');
    });

    it('GIVEN LanguageFilter WHEN multiple language buttons are clicked THEN should call onLanguageToggle for each', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const englishButton = screen.getByLabelText('Select English language');
      const spanishButton = screen.getByLabelText('Select Spanish language');

      // WHEN
      fireEvent.click(englishButton);
      fireEvent.click(spanishButton);

      // THEN
      expect(mockOnLanguageToggle).toHaveBeenCalledTimes(2);
      expect(mockOnLanguageToggle).toHaveBeenNthCalledWith(1, 'en');
      expect(mockOnLanguageToggle).toHaveBeenNthCalledWith(2, 'es');
    });
  });

  describe('Select All Functionality', () => {
    it('GIVEN LanguageFilter WHEN Select All button is clicked THEN should call onSelectAll', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const selectAllButton = screen.getByLabelText('Select all languages');

      // WHEN
      fireEvent.click(selectAllButton);

      // THEN
      expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
    });

    it('GIVEN LanguageFilter with all languages selected WHEN Select All button is clicked THEN should still call onSelectAll', () => {
      // GIVEN
      const selectedLanguages: string[] = ['en', 'es', 'fr', 'de', 'it'];

      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const selectAllButton = screen.getByLabelText('Select all languages');

      // WHEN
      fireEvent.click(selectAllButton);

      // THEN
      expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clear All Functionality', () => {
    it('GIVEN LanguageFilter WHEN Clear All button is clicked THEN should call onClearAll', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const clearAllButton = screen.getByLabelText('Clear all language selections');

      // WHEN
      fireEvent.click(clearAllButton);

      // THEN
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });

    it('GIVEN LanguageFilter with selected languages WHEN Clear All button is clicked THEN should call onClearAll', () => {
      // GIVEN
      const selectedLanguages: string[] = ['en', 'fr'];

      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const clearAllButton = screen.getByLabelText('Clear all language selections');

      // WHEN
      fireEvent.click(clearAllButton);

      // THEN
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('GIVEN LanguageFilter WHEN rendered THEN should have proper ARIA attributes', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      // WHEN
      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Select languages');
      expect(screen.getByLabelText('Select English language')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByLabelText('Select Spanish language')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByLabelText('Select all languages')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear all language selections')).toBeInTheDocument();
    });

    it('GIVEN LanguageFilter WHEN language button is focused THEN should be focusable', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const englishButton = screen.getByLabelText('Select English language');
      englishButton.focus();

      // THEN
      expect(englishButton).toHaveFocus();
    });

    it('GIVEN LanguageFilter WHEN language button is pressed with keyboard THEN should call onLanguageToggle', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      render(
        <LanguageFilter
          languages={mockLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      const englishButton = screen.getByLabelText('Select English language');

      // WHEN
      englishButton.focus();
      fireEvent.keyDown(englishButton, { key: 'Enter', code: 'Enter' });

      // THEN
      expect(mockOnLanguageToggle).toHaveBeenCalledTimes(1);
      expect(mockOnLanguageToggle).toHaveBeenCalledWith('en');
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN LanguageFilter with undefined handlers WHEN rendered THEN should not throw error', () => {
      // GIVEN
      const selectedLanguages: string[] = [];

      // WHEN & THEN
      expect(() => {
        render(
          <LanguageFilter
            languages={mockLanguages}
            selectedLanguages={selectedLanguages}
          />
        );
      }).not.toThrow();
    });

    it('GIVEN LanguageFilter with very long language names WHEN rendered THEN should display full names', () => {
      // GIVEN
      const longNameLanguages: Language[] = [
        { code: 'en', name: 'Very Long Language Name That Should Be Displayed Completely' },
        { code: 'es', name: 'Another Extremely Long Language Name That Exceeds Normal Length' },
      ];
      const selectedLanguages: string[] = [];

      // WHEN
      render(
        <LanguageFilter
          languages={longNameLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('Very Long Language Name That Should Be Displayed Completely')).toBeInTheDocument();
      expect(screen.getByText('Another Extremely Long Language Name That Exceeds Normal Length')).toBeInTheDocument();
    });

    it('GIVEN LanguageFilter with duplicate language codes WHEN rendered THEN should handle gracefully', () => {
      // GIVEN
      const duplicateLanguages: Language[] = [
        { code: 'en', name: 'English' },
        { code: 'en', name: 'English Duplicate' },
        { code: 'es', name: 'Spanish' },
      ];
      const selectedLanguages: string[] = [];

      // WHEN
      render(
        <LanguageFilter
          languages={duplicateLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('English Duplicate')).toBeInTheDocument();
      expect(screen.getByText('Spanish')).toBeInTheDocument();
    });

    it('GIVEN LanguageFilter with special characters in language names WHEN rendered THEN should display correctly', () => {
      // GIVEN
      const specialCharLanguages: Language[] = [
        { code: 'zh', name: '中文 (Chinese)' },
        { code: 'ar', name: 'العربية (Arabic)' },
        { code: 'ru', name: 'Русский (Russian)' },
      ];
      const selectedLanguages: string[] = [];

      // WHEN
      render(
        <LanguageFilter
          languages={specialCharLanguages}
          selectedLanguages={selectedLanguages}
          onLanguageToggle={mockOnLanguageToggle}
          onSelectAll={mockOnSelectAll}
          onClearAll={mockOnClearAll}
        />
      );

      // THEN
      expect(screen.getByText('中文 (Chinese)')).toBeInTheDocument();
      expect(screen.getByText('العربية (Arabic)')).toBeInTheDocument();
      expect(screen.getByText('Русский (Russian)')).toBeInTheDocument();
    });
  });
});
