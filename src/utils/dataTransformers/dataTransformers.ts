import { type OMDbMovie, type OMDbSearchResult } from '../../types/omdb.types';
import { type Movie, type HeroMovie, type MovieSection, type HomePageData } from '../../types/movie.types';
import { QUERY_CONFIG } from '../queryUtils';

/**
 * Transform OMDb search result to generic Movie type
 * @param omdbSearchResult - OMDb search result object
 * @returns Transformed Movie object
 */
export const transformOMDbSearchResultToMovie = (omdbSearchResult: OMDbSearchResult): Movie => {
  return {
    id: omdbSearchResult.imdbID,
    title: omdbSearchResult.Title,
    overview: 'No overview available.',
    poster_path: omdbSearchResult.Poster !== 'N/A' ? omdbSearchResult.Poster : '/placeholder-movie.jpg',
    backdrop_path: omdbSearchResult.Poster !== 'N/A' ? omdbSearchResult.Poster : '/placeholder-movie.jpg',
    release_date: omdbSearchResult.Year ? `${omdbSearchResult.Year}-01-01` : 'N/A',
    vote_average: 0, // Will be updated when we get full details
    vote_count: 0,
    genre_ids: [], // OMDb doesn't provide genre IDs
    adult: false,
    original_language: 'en',
    original_title: omdbSearchResult.Title,
    popularity: 0,
    video: false,
  };
};

/**
 * Transform OMDb movie to generic Movie type
 * @param omdbMovie - OMDb movie object
 * @returns Transformed Movie object
 */
export const transformOMDbMovieToMovie = (omdbMovie: OMDbMovie): Movie => {
  return {
    id: omdbMovie.imdbID,
    title: omdbMovie.Title,
    overview: omdbMovie.Plot !== 'N/A' ? omdbMovie.Plot : 'No overview available.',
    poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/placeholder-movie.jpg',
    backdrop_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/placeholder-movie.jpg',
    release_date: omdbMovie.Released !== 'N/A' ? omdbMovie.Released : 'N/A',
    vote_average: omdbMovie.imdbRating !== 'N/A' ? parseFloat(omdbMovie.imdbRating) : 0,
    vote_count: omdbMovie.imdbVotes !== 'N/A' ? parseInt(omdbMovie.imdbVotes.replace(/,/g, '')) : 0,
    genre_ids: [], // OMDb doesn't provide genre IDs
    adult: false,
    original_language: 'en',
    original_title: omdbMovie.Title,
    popularity: 0,
    video: false,
  };
};

/**
 * Transform OMDb movie to HeroMovie type
 * @param omdbMovie - OMDb movie object
 * @returns Transformed HeroMovie object
 */
export const transformOMDbMovieToHeroMovie = (omdbMovie: OMDbMovie): HeroMovie => {
  return {
    id: omdbMovie.imdbID,
    title: omdbMovie.Title,
    overview: omdbMovie.Plot !== 'N/A' ? omdbMovie.Plot : 'No overview available.',
    poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/placeholder-movie.jpg',
    backdrop_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/placeholder-movie.jpg',
    release_date: omdbMovie.Released !== 'N/A' ? omdbMovie.Released : 'N/A',
    vote_average: omdbMovie.imdbRating !== 'N/A' ? parseFloat(omdbMovie.imdbRating) : 0,
    vote_count: omdbMovie.imdbVotes !== 'N/A' ? parseInt(omdbMovie.imdbVotes.replace(/,/g, '')) : 0,
    genre_ids: [], // OMDb doesn't provide genre IDs
    adult: false,
    original_language: 'en',
    original_title: omdbMovie.Title,
    popularity: 0,
    video: false,
    tagline: '', // OMDb doesn't provide tagline
  };
};

/**
 * Transform arrays of movies into movie sections
 * @param popularMovies - Array of popular movies
 * @param topRatedMovies - Array of top rated movies
 * @param upcomingMovies - Array of upcoming movies
 * @returns Array of MovieSection objects
 */
export const transformMoviesToSections = (
  popularMovies: Movie[],
  topRatedMovies: Movie[],
  upcomingMovies: Movie[]
): MovieSection[] => {
  const sections: MovieSection[] = [];

  // Create trending section from popular movies (most relevant for trending)
  if (popularMovies.length > 0) {
    sections.push({
      title: 'Trending Now',
      movies: popularMovies.slice(0, QUERY_CONFIG.MOVIES_PER_SECTION),
      type: 'trending',
    });
  }

  if (popularMovies.length > 0) {
    sections.push({
      title: 'Big Hits',
      movies: popularMovies.slice(0, QUERY_CONFIG.MOVIES_PER_SECTION),
      type: 'big_hits',
    });
  }

  if (topRatedMovies.length > 0) {
    sections.push({
      title: 'Top Rated',
      movies: topRatedMovies.slice(0, QUERY_CONFIG.MOVIES_PER_SECTION),
      type: 'top_rated',
    });
  }

  if (upcomingMovies.length > 0) {
    sections.push({
      title: 'Recently Released',
      movies: upcomingMovies.slice(0, QUERY_CONFIG.MOVIES_PER_SECTION),
      type: 'recently_released',
    });
  }

  return sections;
};

/**
 * Create HomePageData from hero movie and sections
 * @param heroMovie - Hero movie object (optional)
 * @param sections - Array of movie sections
 * @returns HomePageData object
 */
export const createHomePageData = (
  heroMovie: HeroMovie | undefined,
  sections: MovieSection[]
): HomePageData => {
  return {
    heroMovie: heroMovie || null,
    sections,
  };
};