import { type Movie, type HeroMovie, type MovieSection } from '../types/movie.types';
import { type OMDbMovie, type OMDbSearchResponse } from '../types/omdb.types';

// ============================================================================
// COMMON MOCK DATA
// ============================================================================

export const mockMovie: Movie = {
  id: 'tt1234567',
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/movie.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 7.5,
  vote_count: 1000,
  genre_ids: [],
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie',
  popularity: 0,
  video: false,
};

export const mockHeroMovie: HeroMovie = {
  ...mockMovie,
  backdrop_path: '/f1-movie-backdrop.jpg',
  tagline: 'Test tagline',
};

export const mockOMDbMovie: OMDbMovie = {
  Title: 'Test Movie',
  Year: '2023',
  Rated: 'PG-13',
  Released: '01 Jan 2023',
  Runtime: '120 min',
  Genre: 'Action, Adventure',
  Director: 'Test Director',
  Writer: 'Test Writer',
  Actors: 'Test Actor 1, Test Actor 2',
  Plot: 'Test overview',
  Language: 'English',
  Country: 'USA',
  Awards: 'Test Awards',
  Poster: '/movie.jpg',
  Ratings: [
    { Source: 'Internet Movie Database', Value: '7.5/10' },
    { Source: 'Rotten Tomatoes', Value: '75%' },
    { Source: 'Metacritic', Value: '75/100' },
  ],
  Metascore: '75',
  imdbRating: '7.5',
  imdbVotes: '1,000',
  imdbID: 'tt1234567',
  Type: 'movie',
  DVD: '01 Jan 2023',
  BoxOffice: '$100,000,000',
  Production: 'Test Production',
  Website: 'https://test.com',
  Response: 'True',
};

export const mockOMDbSearchResponse: OMDbSearchResponse = {
  Search: [mockOMDbMovie],
  totalResults: '1',
  Response: 'True',
};

export const mockSection: MovieSection = {
  title: 'Test Section',
  movies: [mockMovie],
  type: 'big_hits',
};

export const mockHomePageData = {
  heroMovie: mockHeroMovie,
  sections: [mockSection],
};

// ============================================================================
// COMMON MOCK CONFIGURATIONS
// ============================================================================

export const mockApiConfig = {
  omdb: {
    apiKey: 'test-omdb-key',
    baseURL: 'https://test-omdb.com',
    timeout: 10000,
  },
};
