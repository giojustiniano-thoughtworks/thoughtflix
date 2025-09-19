import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

/**
 * NotFoundPage component displays a 404 error page
 */
export const NotFoundPage: React.FC = () => {
  return (
    <main
      data-testid="not-found-page"
      className="not-found-page"
      role="main"
      aria-label="Page not found"
    >
      <div className="not-found-page__container">
        <div className="not-found-page__content" data-testid="not-found-content">
          <h1 className="not-found-page__title">Page Not Found</h1>
          <p className="not-found-page__message">
            The page you are looking for does not exist.
          </p>
          <div className="not-found-page__actions" data-testid="not-found-actions">
            <Link to="/" className="not-found-page__link">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

