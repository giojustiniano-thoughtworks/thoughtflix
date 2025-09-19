import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { ROUTES } from '../routing.types';

// Mock the page components
vi.mock('../../pages/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('../../pages/NotFoundPage', () => ({
  NotFoundPage: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

describe('AppRouter', () => {
  describe('Rendering', () => {
    it('GIVEN a router component WHEN rendering with home route THEN should display home page', () => {
      // GIVEN
      const initialEntries = [ROUTES.HOME];

      // WHEN
      render(
        <MemoryRouter
          initialEntries={initialEntries}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRouter />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });


    it('GIVEN a router component WHEN rendering with unknown route THEN should display not found page', () => {
      // GIVEN
      const initialEntries = ['/unknown-route'];

      // WHEN
      render(
        <MemoryRouter
          initialEntries={initialEntries}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRouter />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
      expect(screen.getByText('Not Found Page')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('GIVEN a router component WHEN rendering with different routes THEN should display correct pages', () => {
      // GIVEN
      // WHEN - Test home route
      const { unmount } = render(
        <MemoryRouter
          initialEntries={[ROUTES.HOME]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRouter />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      unmount();

      // WHEN - Test 404 route
      render(
        <MemoryRouter
          initialEntries={[ROUTES.NOT_FOUND]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRouter />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('GIVEN a router component WHEN rendering with invalid route THEN should display not found page', () => {
      // GIVEN
      const initialEntries = ['/invalid/route/with/many/segments'];

      // WHEN
      render(
        <MemoryRouter
          initialEntries={initialEntries}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRouter />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('GIVEN a router component WHEN rendering with empty route THEN should redirect to home', () => {
      // GIVEN
      const initialEntries = [''];

      // WHEN
      render(
        <MemoryRouter
          initialEntries={initialEntries}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRouter />
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

});
