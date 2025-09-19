import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

// Helper function to render NotFoundPage with MemoryRouter
const renderNotFoundPage = (props = {}) => {
  return render(
    <MemoryRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <NotFoundPage {...props} />
    </MemoryRouter>
  );
};

describe('NotFoundPage', () => {
  describe('Rendering', () => {
    it('GIVEN a not found page component WHEN rendering THEN should display not found page content', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('GIVEN a not found page component WHEN rendering THEN should display error message', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
    });

    it('GIVEN a not found page component WHEN rendering THEN should display back to home link', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });
  });

  describe('Content Structure', () => {
    it('GIVEN a not found page component WHEN rendering THEN should have proper main element', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveAttribute('data-testid', 'not-found-page');
    });

    it('GIVEN a not found page component WHEN rendering THEN should have proper heading structure', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Page Not Found');
    });

    it('GIVEN a not found page component WHEN rendering THEN should have proper content sections', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      expect(screen.getByTestId('not-found-content')).toBeInTheDocument();
      expect(screen.getByTestId('not-found-actions')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('GIVEN a not found page component WHEN rendering THEN should have proper ARIA labels', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveAttribute('aria-label', 'Page not found');
    });

    it('GIVEN a not found page component WHEN rendering THEN should have proper heading hierarchy', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Page Not Found');
    });

    it('GIVEN a not found page component WHEN rendering THEN should have proper link accessibility', () => {
      // GIVEN
      // WHEN
      renderNotFoundPage();

      // THEN
      const link = screen.getByRole('link', { name: 'Back to Home' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
