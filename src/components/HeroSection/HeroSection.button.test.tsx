import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { HeroSection } from './HeroSection';
import { type HeroMovie } from '../../types/movie.types';

describe('HeroSection Button Functionality', () => {
  const mockHeroMovie: HeroMovie = {
    id: 'tt1234567',
    title: 'F1: The Movie',
    overview: 'A Formula One driver comes out of retirement to mentor and team up with a younger driver.',
    poster_path: '/f1-movie-poster.jpg',
    backdrop_path: '/f1-movie-backdrop.jpg',
    release_date: '2025-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [1, 2, 3],
    adult: false,
    original_language: 'en',
    original_title: 'F1: The Movie',
    popularity: 100,
    video: false,
    tagline: 'Speed meets destiny',
  };

  const mockOnPlayClick = vi.fn();
  const mockOnMoreInfoClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Play Button Functionality', () => {
    it('GIVEN a hero section with play button WHEN play button is clicked THEN should call onPlayClick with movie data', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      fireEvent.click(playButton);

      // THEN
      expect(mockOnPlayClick).toHaveBeenCalledTimes(1);
      expect(mockOnPlayClick).toHaveBeenCalledWith(mockHeroMovie);
    });

    it('GIVEN a hero section without onPlayClick prop WHEN play button is clicked THEN should not throw error', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      
      // THEN
      expect(() => fireEvent.click(playButton)).not.toThrow();
    });

    it('GIVEN a hero section WHEN play button is clicked via keyboard THEN should call onPlayClick', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      playButton.focus();
      fireEvent.keyDown(playButton, { key: 'Enter' });

      // THEN
      expect(mockOnPlayClick).toHaveBeenCalledTimes(1);
      expect(mockOnPlayClick).toHaveBeenCalledWith(mockHeroMovie);
    });

    it('GIVEN a hero section WHEN play button is clicked via space key THEN should call onPlayClick', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      playButton.focus();
      fireEvent.keyDown(playButton, { key: ' ' });

      // THEN
      expect(mockOnPlayClick).toHaveBeenCalledTimes(1);
      expect(mockOnPlayClick).toHaveBeenCalledWith(mockHeroMovie);
    });
  });

  describe('More Info Button Functionality', () => {
    it('GIVEN a hero section with more info button WHEN more info button is clicked THEN should call onMoreInfoClick with movie data', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });
      fireEvent.click(moreInfoButton);

      // THEN
      expect(mockOnMoreInfoClick).toHaveBeenCalledTimes(1);
      expect(mockOnMoreInfoClick).toHaveBeenCalledWith(mockHeroMovie);
    });

    it('GIVEN a hero section without onMoreInfoClick prop WHEN more info button is clicked THEN should not throw error', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
        />
      );

      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });
      
      // THEN
      expect(() => fireEvent.click(moreInfoButton)).not.toThrow();
    });

    it('GIVEN a hero section WHEN more info button is clicked via keyboard THEN should call onMoreInfoClick', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });
      moreInfoButton.focus();
      fireEvent.keyDown(moreInfoButton, { key: 'Enter' });

      // THEN
      expect(mockOnMoreInfoClick).toHaveBeenCalledTimes(1);
      expect(mockOnMoreInfoClick).toHaveBeenCalledWith(mockHeroMovie);
    });

    it('GIVEN a hero section WHEN more info button is clicked via space key THEN should call onMoreInfoClick', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });
      moreInfoButton.focus();
      fireEvent.keyDown(moreInfoButton, { key: ' ' });

      // THEN
      expect(mockOnMoreInfoClick).toHaveBeenCalledTimes(1);
      expect(mockOnMoreInfoClick).toHaveBeenCalledWith(mockHeroMovie);
    });
  });

  describe('Button Accessibility', () => {
    it('GIVEN a hero section WHEN rendering THEN buttons should have proper ARIA labels', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      // THEN
      expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'More Info' })).toBeInTheDocument();
    });

    it('GIVEN a hero section WHEN rendering THEN buttons should be keyboard navigable', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });

      // THEN
      expect(playButton).toBeInTheDocument();
      expect(moreInfoButton).toBeInTheDocument();

      // Test keyboard navigation
      playButton.focus();
      expect(document.activeElement).toBe(playButton);

      moreInfoButton.focus();
      expect(document.activeElement).toBe(moreInfoButton);
    });

    it('GIVEN a hero section WHEN rendering THEN buttons should have proper tab order', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });

      // THEN
      expect(playButton).toHaveAttribute('tabIndex', '0');
      expect(moreInfoButton).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Button Visual States', () => {
    it('GIVEN a hero section WHEN rendering THEN buttons should have proper styling classes', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });

      // THEN
      expect(playButton).toHaveClass('hero-button', 'hero-button--primary');
      expect(moreInfoButton).toHaveClass('hero-button', 'hero-button--secondary');
    });

    it('GIVEN a hero section WHEN rendering THEN buttons should have proper icons', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });

      // THEN
      expect(playButton).toHaveTextContent('▶');
      expect(moreInfoButton).toHaveTextContent('ℹ');
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN a hero section with null movie WHEN rendering THEN should handle gracefully', () => {
      // GIVEN
      const nullMovie = null;
      
      // WHEN
      render(
        <HeroSection
          movie={nullMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      // THEN
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    it('GIVEN a hero section with undefined handlers WHEN buttons are clicked THEN should not throw errors', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={undefined}
          onMoreInfoClick={undefined}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });

      // THEN
      expect(() => fireEvent.click(playButton)).not.toThrow();
      expect(() => fireEvent.click(moreInfoButton)).not.toThrow();
    });

    it('GIVEN a hero section WHEN buttons are clicked multiple times THEN should call handlers multiple times', () => {
      // GIVEN
      // WHEN
      render(
        <HeroSection
          movie={mockHeroMovie}
          onPlayClick={mockOnPlayClick}
          onMoreInfoClick={mockOnMoreInfoClick}
        />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      const moreInfoButton = screen.getByRole('button', { name: 'More Info' });

      fireEvent.click(playButton);
      fireEvent.click(playButton);
      fireEvent.click(moreInfoButton);
      fireEvent.click(moreInfoButton);

      // THEN
      expect(mockOnPlayClick).toHaveBeenCalledTimes(2);
      expect(mockOnMoreInfoClick).toHaveBeenCalledTimes(2);
    });
  });
});

