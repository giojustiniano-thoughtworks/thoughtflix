import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../routing.types';
import { NavigationWrapper } from '../../components/NavigationWrapper';

// Import page components
import { HomePage } from '../../pages/HomePage';
import { MovieDetailsPage } from '../../pages/MovieDetailsPage';
import { NotFoundPage } from '../../pages/NotFoundPage';

/**
 * AppRouter component that handles all routing for the application
 * Uses React Router v6 with TypeScript support
 */
export const AppRouter: React.FC = () => {
  return (
    <NavigationWrapper>
      <Routes>
        {/* Home route */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        
        {/* Movie details route */}
        <Route path={ROUTES.MOVIE_DETAILS} element={<MovieDetailsPage />} />
        
        {/* 404 route */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        
        {/* Catch-all route - redirect to 404 */}
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </NavigationWrapper>
  );
};
