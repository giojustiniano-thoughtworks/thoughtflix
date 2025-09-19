// OMDb API specific types and interfaces
import { type BaseApiConfig } from './api.types';

export interface OMDbConfig extends BaseApiConfig {
  readonly apiKey: string | null;
}

export interface OMDbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OMDbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: 'True' | 'False';
  Error?: string;
}

export interface OMDbRating {
  Source: string;
  Value: string;
}

export interface OMDbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface OMDbSearchResponse {
  Search: OMDbSearchResult[];
  totalResults: string;
  Response: 'True' | 'False';
  Error?: string;
}

export interface OMDbSearchParams {
  s: string; // Search term
  type?: 'movie' | 'series' | 'episode';
  y?: string; // Year
  page?: number;
  plot?: 'short' | 'full';
}

export interface OMDbMovieParams {
  i?: string; // IMDb ID
  t?: string; // Title
  type?: 'movie' | 'series' | 'episode';
  y?: string; // Year
  plot?: 'short' | 'full';
}


