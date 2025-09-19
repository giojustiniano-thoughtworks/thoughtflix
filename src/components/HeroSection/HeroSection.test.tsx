import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { HeroSection } from './HeroSection';
import { type HeroMovie } from '../../types/movie.types';

describe('HeroSection', () => {
  const mockHeroMovie: HeroMovie = {
    id: 1,
    title: 'Stranger Things',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and a strange little girl.',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '2016-07-15',
    vote_average: 8.7,
    vote_count: 1000,
    genre_ids: [18, 14, 27],
    adult: false,
    original_language: 'en',
    original_title: 'Stranger Things',
    popularity: 85.5,
    video: false,
    tagline: 'Something is coming...',
  };

  describe('Rendering', () => {
    const renderingTestCases = [
      {
        description: 'movie title',
        testId: 'hero-title',
        expectedText: 'Stranger Things',
        movie: mockHeroMovie,
      },
      {
        description: 'movie overview',
        testId: 'hero-overview',
        expectedText: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and a strange little girl.',
        movie: mockHeroMovie,
      },
    ];

    renderingTestCases.forEach(({ description, testId, expectedText, movie }) => {
      it(`GIVEN a hero movie WHEN rendering HeroSection THEN should display ${description}`, () => {
        // GIVEN
        const movieData = movie;

        // WHEN
        render(<HeroSection movie={movieData} />);

        // THEN
        expect(screen.getByTestId(testId)).toHaveTextContent(expectedText);
      });
    });

    const buttonTestCases = [
      {
        description: 'play button',
        buttonName: /play/i,
        movie: mockHeroMovie,
      },
      {
        description: 'more info button',
        buttonName: /more info/i,
        movie: mockHeroMovie,
      },
    ];

    buttonTestCases.forEach(({ description, buttonName, movie }) => {
      it(`GIVEN a hero movie WHEN rendering HeroSection THEN should display ${description}`, () => {
        // GIVEN
        const movieData = movie;

        // WHEN
        render(<HeroSection movie={movieData} />);

        // THEN
        expect(screen.getByRole('button', { name: buttonName })).toBeInTheDocument();
      });
    });

    const taglineTestCases = [
      {
        description: 'with tagline',
        movie: { ...mockHeroMovie, tagline: 'Something is coming...' },
        shouldDisplay: true,
        expectedText: 'Something is coming...',
      },
      {
        description: 'without tagline',
        movie: { ...mockHeroMovie, tagline: undefined },
        shouldDisplay: false,
        expectedText: 'Something is coming...',
      },
    ];

    taglineTestCases.forEach(({ description, movie, shouldDisplay, expectedText }) => {
      it(`GIVEN a hero movie ${description} WHEN rendering HeroSection THEN should ${shouldDisplay ? 'display' : 'not display'} tagline`, () => {
        // GIVEN
        const movieData = movie;

        // WHEN
        render(<HeroSection movie={movieData} />);

        // THEN
        if (shouldDisplay) {
          expect(screen.getByText(expectedText)).toBeInTheDocument();
        } else {
          expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
        }
      });
    });
  });

  describe('User Interactions', () => {
    const interactionTestCases = [
      {
        description: 'onPlayClick handler',
        buttonName: /play/i,
        handlerName: 'onPlayClick',
        movie: mockHeroMovie,
      },
      {
        description: 'onMoreInfoClick handler',
        buttonName: /more info/i,
        handlerName: 'onMoreInfoClick',
        movie: mockHeroMovie,
      },
    ];

    interactionTestCases.forEach(({ description, buttonName, handlerName, movie }) => {
      it(`GIVEN a hero movie with ${description} WHEN clicking button THEN should call handler with movie`, () => {
        // GIVEN
        const movieData = movie;
        const handler = vi.fn();

        // WHEN
        render(<HeroSection movie={movieData} {...{ [handlerName]: handler }} />);
        fireEvent.click(screen.getByRole('button', { name: buttonName }));

        // THEN
        expect(handler).toHaveBeenCalledWith(movie);
      });

      it(`GIVEN a hero movie without ${description} WHEN clicking button THEN should not throw error`, () => {
        // GIVEN
        const movieData = movie;

        // WHEN & THEN
        expect(() => {
          render(<HeroSection movie={movieData} />);
          fireEvent.click(screen.getByRole('button', { name: buttonName }));
        }).not.toThrow();
      });
    });
  });

  describe('Styling and Layout', () => {
    it('GIVEN a hero movie WHEN rendering HeroSection THEN should have hero section class', () => {
      // GIVEN
      const movie = mockHeroMovie;

      // WHEN
      render(<HeroSection movie={movie} />);

      // THEN
      expect(screen.getByTestId('hero-section')).toHaveClass('hero-section');
    });

    it('GIVEN a hero movie WHEN rendering HeroSection THEN should display background image', () => {
      // GIVEN
      const movie = mockHeroMovie;

      // WHEN
      render(<HeroSection movie={movie} />);

      // THEN
      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveStyle({
        backgroundImage: `url(${movie.backdrop_path})`,
      });
    });

    it('GIVEN a hero movie WHEN rendering HeroSection THEN should have proper content structure', () => {
      // GIVEN
      const movie = mockHeroMovie;

      // WHEN
      render(<HeroSection movie={movie} />);

      // THEN
      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
      expect(screen.getByTestId('hero-title')).toBeInTheDocument();
      expect(screen.getByTestId('hero-overview')).toBeInTheDocument();
      expect(screen.getByTestId('hero-actions')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    const edgeCaseTestCases = [
      {
        description: 'empty title',
        movie: { ...mockHeroMovie, title: '' },
        testId: 'hero-title',
      },
      {
        description: 'empty overview',
        movie: { ...mockHeroMovie, overview: '' },
        testId: 'hero-overview',
      },
      {
        description: 'very long title',
        movie: { ...mockHeroMovie, title: 'A'.repeat(200) },
        testId: 'hero-title',
        expectedText: 'A'.repeat(200),
      },
      {
        description: 'very long overview',
        movie: { ...mockHeroMovie, overview: 'A'.repeat(1000) },
        testId: 'hero-overview',
        expectedText: 'A'.repeat(1000),
      },
    ];

    edgeCaseTestCases.forEach(({ description, movie, testId, expectedText }) => {
      it(`GIVEN a hero movie with ${description} WHEN rendering HeroSection THEN should handle gracefully`, () => {
        // GIVEN
        const movieData = movie;

        // WHEN
        render(<HeroSection movie={movieData} />);

        // THEN
        const element = screen.getByTestId(testId);
        expect(element).toBeInTheDocument();
        if (expectedText) {
          expect(element).toHaveTextContent(expectedText);
        }
      });
    });
  });
});
