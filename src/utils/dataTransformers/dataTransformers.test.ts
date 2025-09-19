import { describe, it, expect } from 'vitest';
import { 
  transformOMDbSearchResultToMovie, 
  transformOMDbMovieToMovie, 
  transformOMDbMovieToHeroMovie,
  transformMoviesToSections,
  createHomePageData
} from './dataTransformers';
  import { type OMDbMovie, type OMDbSearchResult } from '../../types/omdb.types';
  import { type Movie, type HeroMovie, type MovieSection, type HomePageData } from '../../types/movie.types';

describe('Data Transformers', () => {
  describe('transformOMDbSearchResultToMovie', () => {
    const searchResultTestCases = [
      {
        description: 'valid OMDbSearchResult',
        omdbSearchResult: {
          Title: 'Test Movie',
          Year: '2023',
          imdbID: 'tt1234567',
          Type: 'movie',
          Poster: 'https://example.com/poster.jpg',
        } as OMDbSearchResult,
        expectedMovie: {
          id: 'tt1234567',
          title: 'Test Movie',
          overview: 'No overview available.',
          poster_path: 'https://example.com/poster.jpg',
          backdrop_path: 'https://example.com/poster.jpg',
          release_date: '2023-01-01',
          vote_average: 0,
          vote_count: 0,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          original_title: 'Test Movie',
          popularity: 0,
          video: false,
        },
      },
      {
        description: 'OMDbSearchResult with N/A poster',
        omdbSearchResult: {
          Title: 'Test Movie',
          Year: '2023',
          imdbID: 'tt1234567',
          Type: 'movie',
          Poster: 'N/A',
        } as OMDbSearchResult,
        expectedMovie: {
          id: 'tt1234567',
          title: 'Test Movie',
          overview: 'No overview available.',
          poster_path: '/placeholder-movie.jpg',
          backdrop_path: '/placeholder-movie.jpg',
          release_date: '2023-01-01',
          vote_average: 0,
          vote_count: 0,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          original_title: 'Test Movie',
          popularity: 0,
          video: false,
        },
      },
    ];

    searchResultTestCases.forEach(({ description, omdbSearchResult, expectedMovie }) => {
      it(`GIVEN ${description} WHEN transforming to Movie THEN should return correct Movie object`, () => {
        // GIVEN
        const searchResult = omdbSearchResult;

        // WHEN
        const movie: Movie = transformOMDbSearchResultToMovie(searchResult);

        // THEN
        expect(movie).toEqual(expectedMovie);
      });
    });
  });

  describe('transformOMDbMovieToMovie', () => {
    const omdbMovieTestCases = [
      {
        description: 'valid OMDbMovie',
        omdbMovie: {
          Title: 'Test Movie',
          Year: '2023',
          Rated: 'PG-13',
          Released: '2023-01-15',
          Runtime: '120 min',
          Genre: 'Action, Drama',
          Director: 'John Doe',
          Writer: 'Jane Doe',
          Actors: 'Actor One, Actor Two',
          Plot: 'A test movie plot.',
          Language: 'English',
          Country: 'USA',
          Awards: 'Test Award',
          Poster: 'https://example.com/poster.jpg',
          Ratings: [
            { Source: 'Internet Movie Database', Value: '8.5/10' },
            { Source: 'Rotten Tomatoes', Value: '85%' },
          ],
          Metascore: '85',
          imdbRating: '8.5',
          imdbVotes: '1,000',
          imdbID: 'tt1234567',
          Type: 'movie',
          DVD: '2023-02-01',
          BoxOffice: '$100,000,000',
          Production: 'Test Studio',
          Website: 'https://testmovie.com',
          Response: 'True',
        } as OMDbMovie,
        expectedMovie: {
          id: 'tt1234567',
          title: 'Test Movie',
          overview: 'A test movie plot.',
          poster_path: 'https://example.com/poster.jpg',
          backdrop_path: 'https://example.com/poster.jpg',
          release_date: '2023-01-15',
          vote_average: 8.5,
          vote_count: 1000,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          original_title: 'Test Movie',
          popularity: 0,
          video: false,
        },
      },
      {
        description: 'OMDbMovie with N/A values',
        omdbMovie: {
          Title: 'Test Movie',
          Year: '2023',
          Rated: 'N/A',
          Released: 'N/A',
          Runtime: 'N/A',
          Genre: 'N/A',
          Director: 'N/A',
          Writer: 'N/A',
          Actors: 'N/A',
          Plot: 'N/A',
          Language: 'N/A',
          Country: 'N/A',
          Awards: 'N/A',
          Poster: 'N/A',
          Ratings: [],
          Metascore: 'N/A',
          imdbRating: 'N/A',
          imdbVotes: 'N/A',
          imdbID: 'tt1234567',
          Type: 'movie',
          DVD: 'N/A',
          BoxOffice: 'N/A',
          Production: 'N/A',
          Website: 'N/A',
          Response: 'True',
        } as OMDbMovie,
        expectedMovie: {
          id: 'tt1234567',
          title: 'Test Movie',
          overview: 'No overview available.',
          poster_path: '/placeholder-movie.jpg',
          backdrop_path: '/placeholder-movie.jpg',
          release_date: 'N/A',
          vote_average: 0,
          vote_count: 0,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          original_title: 'Test Movie',
          popularity: 0,
          video: false,
        },
      },
    ];

    omdbMovieTestCases.forEach(({ description, omdbMovie, expectedMovie }) => {
      it(`GIVEN ${description} WHEN transforming to Movie THEN should return correct Movie object`, () => {
        // GIVEN
        const movieData = omdbMovie;

        // WHEN
        const movie: Movie = transformOMDbMovieToMovie(movieData);

        // THEN
        expect(movie).toEqual(expectedMovie);
      });
    });
  });

  describe('transformOMDbMovieToHeroMovie', () => {
    it('GIVEN a valid OMDbMovie WHEN transforming to HeroMovie THEN should return correct HeroMovie object', () => {
      // GIVEN
      const omdbMovie: OMDbMovie = {
        Title: 'Hero Movie',
        Year: '2023',
        Rated: 'PG-13',
        Released: '2023-01-15',
        Runtime: '120 min',
        Genre: 'Action, Drama',
        Director: 'John Doe',
        Writer: 'Jane Doe',
        Actors: 'Actor One, Actor Two',
        Plot: 'A hero movie plot.',
        Language: 'English',
        Country: 'USA',
        Awards: 'Test Award',
        Poster: 'https://example.com/poster.jpg',
        Ratings: [
          { Source: 'Internet Movie Database', Value: '9.0/10' },
          { Source: 'Rotten Tomatoes', Value: '90%' },
        ],
        Metascore: '90',
        imdbRating: '9.0',
        imdbVotes: '2,000',
        imdbID: 'tt1234567',
        Type: 'movie',
        DVD: '2023-02-01',
        BoxOffice: '$200,000,000',
        Production: 'Hero Studio',
        Website: 'https://heromovie.com',
        Response: 'True',
      };

      // WHEN
      const heroMovie: HeroMovie = transformOMDbMovieToHeroMovie(omdbMovie);

      // THEN
      expect(heroMovie).toEqual({
        id: 'tt1234567',
        title: 'Hero Movie',
        overview: 'A hero movie plot.',
        poster_path: 'https://example.com/poster.jpg',
        backdrop_path: 'https://example.com/poster.jpg',
        release_date: '2023-01-15',
        vote_average: 9.0,
        vote_count: 2000,
        genre_ids: [],
        adult: false,
        original_language: 'en',
        original_title: 'Hero Movie',
        popularity: 0,
        video: false,
        tagline: '',
      });
    });
  });

  describe('transformMoviesToSections', () => {
    it('GIVEN arrays of movies WHEN transforming to sections THEN should return correct MovieSection array', () => {
      // GIVEN
      const popularMovies: Movie[] = [
        { id: '1', title: 'Popular 1', overview: 'Overview 1', poster_path: '/1.jpg', backdrop_path: '/1.jpg', release_date: '2023-01-01', vote_average: 8.0, vote_count: 100, genre_ids: [], adult: false, original_language: 'en', original_title: 'Popular 1', popularity: 0, video: false },
        { id: '2', title: 'Popular 2', overview: 'Overview 2', poster_path: '/2.jpg', backdrop_path: '/2.jpg', release_date: '2023-01-02', vote_average: 7.5, vote_count: 200, genre_ids: [], adult: false, original_language: 'en', original_title: 'Popular 2', popularity: 0, video: false },
      ];
      const topRatedMovies: Movie[] = [
        { id: '3', title: 'Top 1', overview: 'Overview 3', poster_path: '/3.jpg', backdrop_path: '/3.jpg', release_date: '2023-01-03', vote_average: 9.0, vote_count: 300, genre_ids: [], adult: false, original_language: 'en', original_title: 'Top 1', popularity: 0, video: false },
      ];
      const upcomingMovies: Movie[] = [
        { id: '4', title: 'Upcoming 1', overview: 'Overview 4', poster_path: '/4.jpg', backdrop_path: '/4.jpg', release_date: '2023-01-04', vote_average: 6.5, vote_count: 400, genre_ids: [], adult: false, original_language: 'en', original_title: 'Upcoming 1', popularity: 0, video: false },
      ];

      // WHEN
      const sections: MovieSection[] = transformMoviesToSections(popularMovies, topRatedMovies, upcomingMovies);

      // THEN
      expect(sections).toHaveLength(4);
      expect(sections[0]).toEqual({
        title: 'Trending Now',
        movies: popularMovies,
        type: 'trending',
      });
      expect(sections[1]).toEqual({
        title: 'Big Hits',
        movies: popularMovies,
        type: 'big_hits',
      });
      expect(sections[2]).toEqual({
        title: 'Top Rated',
        movies: topRatedMovies,
        type: 'top_rated',
      });
      expect(sections[3]).toEqual({
        title: 'Recently Released',
        movies: upcomingMovies,
        type: 'recently_released',
      });
    });

    it('GIVEN empty arrays WHEN transforming to sections THEN should return empty sections', () => {
      // GIVEN
      const popularMovies: Movie[] = [];
      const topRatedMovies: Movie[] = [];
      const upcomingMovies: Movie[] = [];

      // WHEN
      const sections: MovieSection[] = transformMoviesToSections(popularMovies, topRatedMovies, upcomingMovies);

      // THEN
      expect(sections).toHaveLength(0);
    });
  });

  describe('createHomePageData', () => {
    it('GIVEN valid hero movie and sections WHEN creating HomePageData THEN should return correct structure', () => {
      // GIVEN
      const heroMovie: HeroMovie = {
        id: 'tt1234567',
        title: 'Hero Movie',
        overview: 'Hero overview',
        poster_path: '/hero.jpg',
        backdrop_path: '/hero_backdrop.jpg',
        release_date: '2023-01-01',
        vote_average: 8.5,
        vote_count: 1000,
        genre_ids: [],
        adult: false,
        original_language: 'en',
        original_title: 'Hero Movie',
        popularity: 0,
        video: false,
        tagline: 'Hero tagline',
      };
      const sections: MovieSection[] = [
        {
          title: 'Big Hits',
          movies: [],
          type: 'big_hits',
        },
      ];

      // WHEN
      const homePageData: HomePageData = createHomePageData(heroMovie, sections);

      // THEN
      expect(homePageData).toEqual({
        heroMovie,
        sections,
      });
    });

    it('GIVEN undefined hero movie WHEN creating HomePageData THEN should return undefined hero movie', () => {
      // GIVEN
      const sections: MovieSection[] = [
        {
          title: 'Big Hits',
          movies: [],
          type: 'big_hits',
        },
      ];

      // WHEN
      const homePageData: HomePageData = createHomePageData(undefined, sections);

      // THEN
      expect(homePageData).toEqual({
        heroMovie: null,
        sections,
      });
    });
  });
});