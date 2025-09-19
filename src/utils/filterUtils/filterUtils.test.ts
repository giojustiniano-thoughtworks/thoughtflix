import { describe, it, expect } from 'vitest';
import {
  filterMovies,
  sortMovies,
  getAvailableGenres,
  getAvailableLanguages,
  getAvailableYears,
  getFilteredMovieCount,
  hasActiveFilters,
  getFilterSummary,
} from './filterUtils';
import { type Movie, type MovieFilters, type Genre, type Language } from '../../types/movie.types';

describe('Filter Utils', () => {
  const mockGenres: Genre[] = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Horror' },
  ];

  const mockLanguages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
  ];

  const mockMovies: Movie[] = [
    {
      id: '1',
      title: 'Action Movie',
      overview: 'An action-packed movie',
      poster_path: '/poster1.jpg',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [1, 2],
      adult: false,
      original_language: 'en',
      original_title: 'Action Movie',
      popularity: 100,
      video: false,
    },
    {
      id: '2',
      title: 'Comedy Movie',
      overview: 'A funny movie',
      poster_path: '/poster2.jpg',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2022-06-15',
      vote_average: 7.2,
      vote_count: 500,
      genre_ids: [2, 3],
      adult: false,
      original_language: 'es',
      original_title: 'Comedy Movie',
      popularity: 80,
      video: false,
    },
    {
      id: '3',
      title: 'Drama Movie',
      overview: 'A dramatic movie',
      poster_path: '/poster3.jpg',
      backdrop_path: '/backdrop3.jpg',
      release_date: '2021-12-01',
      vote_average: 9.1,
      vote_count: 2000,
      genre_ids: [3, 4],
      adult: false,
      original_language: 'fr',
      original_title: 'Drama Movie',
      popularity: 60,
      video: false,
    },
  ];

  describe('Filter Movies', () => {
    it('GIVEN movies and empty filters WHEN filterMovies is called THEN should return all movies', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = filterMovies(mockMovies, filters);

      // THEN
      expect(result).toEqual(mockMovies);
    });

    it('GIVEN movies and genre filter WHEN filterMovies is called THEN should return movies matching selected genres', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [1], // Action
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = filterMovies(mockMovies, filters);

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('GIVEN movies and language filter WHEN filterMovies is called THEN should return movies matching selected languages', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: ['en'],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = filterMovies(mockMovies, filters);

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('GIVEN movies and year filter WHEN filterMovies is called THEN should return movies matching selected years', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [2023],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = filterMovies(mockMovies, filters);

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('GIVEN movies and multiple filters WHEN filterMovies is called THEN should return movies matching all selected filters', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [2], // Comedy
        selectedLanguages: ['es'],
        selectedReleaseYears: [2022],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = filterMovies(mockMovies, filters);

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('GIVEN movies and filters with no matches WHEN filterMovies is called THEN should return empty array', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [999], // Non-existent genre
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = filterMovies(mockMovies, filters);

      // THEN
      expect(result).toHaveLength(0);
    });
  });

  describe('Sort Movies', () => {
    it('GIVEN movies and popularity sort WHEN sortMovies is called THEN should sort by popularity descending', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = sortMovies(mockMovies, filters);

      // THEN
      expect(result[0].popularity).toBe(100);
      expect(result[1].popularity).toBe(80);
      expect(result[2].popularity).toBe(60);
    });

    it('GIVEN movies and popularity sort ascending WHEN sortMovies is called THEN should sort by popularity ascending', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'asc',
      };

      // WHEN
      const result = sortMovies(mockMovies, filters);

      // THEN
      expect(result[0].popularity).toBe(60);
      expect(result[1].popularity).toBe(80);
      expect(result[2].popularity).toBe(100);
    });

    it('GIVEN movies and vote_average sort WHEN sortMovies is called THEN should sort by vote average', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'vote_average',
        sortOrder: 'desc',
      };

      // WHEN
      const result = sortMovies(mockMovies, filters);

      // THEN
      expect(result[0].vote_average).toBe(9.1);
      expect(result[1].vote_average).toBe(8.5);
      expect(result[2].vote_average).toBe(7.2);
    });

    it('GIVEN movies and release_date sort WHEN sortMovies is called THEN should sort by release date', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'release_date',
        sortOrder: 'desc',
      };

      // WHEN
      const result = sortMovies(mockMovies, filters);

      // THEN
      expect(result[0].release_date).toBe('2023-01-01');
      expect(result[1].release_date).toBe('2022-06-15');
      expect(result[2].release_date).toBe('2021-12-01');
    });

    it('GIVEN movies and title sort WHEN sortMovies is called THEN should sort by title alphabetically', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'title',
        sortOrder: 'asc',
      };

      // WHEN
      const result = sortMovies(mockMovies, filters);

      // THEN
      expect(result[0].title).toBe('Action Movie');
      expect(result[1].title).toBe('Comedy Movie');
      expect(result[2].title).toBe('Drama Movie');
    });
  });

  describe('Get Available Genres', () => {
    it('GIVEN movies and genres WHEN getAvailableGenres is called THEN should return genres that exist in movies', () => {
      // GIVEN
      const movies = mockMovies;

      // WHEN
      const result = getAvailableGenres(movies, mockGenres);

      // THEN
      expect(result).toHaveLength(4);
      expect(result.map(g => g.id)).toEqual(expect.arrayContaining([1, 2, 3, 4]));
    });

    it('GIVEN empty movies array WHEN getAvailableGenres is called THEN should return empty array', () => {
      // GIVEN
      const movies: Movie[] = [];

      // WHEN
      const result = getAvailableGenres(movies, mockGenres);

      // THEN
      expect(result).toHaveLength(0);
    });
  });

  describe('Get Available Languages', () => {
    it('GIVEN movies WHEN getAvailableLanguages is called THEN should return unique languages from movies', () => {
      // GIVEN
      const movies = mockMovies;

      // WHEN
      const result = getAvailableLanguages(movies, mockLanguages);

      // THEN
      expect(result).toHaveLength(3);
      expect(result.map(l => l.code)).toEqual(expect.arrayContaining(['en', 'es', 'fr']));
    });

    it('GIVEN empty movies array WHEN getAvailableLanguages is called THEN should return empty array', () => {
      // GIVEN
      const movies: Movie[] = [];

      // WHEN
      const result = getAvailableLanguages(movies, mockLanguages);

      // THEN
      expect(result).toHaveLength(0);
    });
  });

  describe('Get Available Years', () => {
    it('GIVEN movies WHEN getAvailableYears is called THEN should return unique years from movies', () => {
      // GIVEN
      const movies = mockMovies;

      // WHEN
      const result = getAvailableYears(movies);

      // THEN
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining([2023, 2022, 2021]));
    });

    it('GIVEN empty movies array WHEN getAvailableYears is called THEN should return empty array', () => {
      // GIVEN
      const movies: Movie[] = [];

      // WHEN
      const result = getAvailableYears(movies);

      // THEN
      expect(result).toHaveLength(0);
    });
  });

  describe('Get Filtered Movie Count', () => {
    it('GIVEN movies and filters WHEN getFilteredMovieCount is called THEN should return count of filtered movies', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [1],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = getFilteredMovieCount(mockMovies, filters);

      // THEN
      expect(result).toBe(1);
    });

    it('GIVEN movies and empty filters WHEN getFilteredMovieCount is called THEN should return total movie count', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = getFilteredMovieCount(mockMovies, filters);

      // THEN
      expect(result).toBe(3);
    });
  });

  describe('Has Active Filters', () => {
    it('GIVEN filters with selections WHEN hasActiveFilters is called THEN should return true', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [1],
        selectedLanguages: ['en'],
        selectedReleaseYears: [2023],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = hasActiveFilters(filters);

      // THEN
      expect(result).toBe(true);
    });

    it('GIVEN filters with no selections WHEN hasActiveFilters is called THEN should return false', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = hasActiveFilters(filters);

      // THEN
      expect(result).toBe(false);
    });
  });

  describe('Get Filter Summary', () => {
    it('GIVEN filters with selections WHEN getFilterSummary is called THEN should return summary string', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [1, 2],
        selectedLanguages: ['en'],
        selectedReleaseYears: [2023],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = getFilterSummary(filters, mockGenres, mockLanguages);

      // THEN
      expect(result).toContain('Action, Comedy');
      expect(result).toContain('English');
      expect(result).toContain('2023');
    });

    it('GIVEN filters with no selections WHEN getFilterSummary is called THEN should return default message', () => {
      // GIVEN
      const filters: MovieFilters = {
        selectedGenres: [],
        selectedLanguages: [],
        selectedReleaseYears: [],
        sortBy: 'popularity',
        sortOrder: 'desc',
      };

      // WHEN
      const result = getFilterSummary(filters, mockGenres, mockLanguages);

      // THEN
      expect(result).toBe('All movies');
    });
  });
});
