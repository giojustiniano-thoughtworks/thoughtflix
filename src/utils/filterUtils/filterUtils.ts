import { type Movie, type MovieFilters, type Genre, type Language } from '../../types/movie.types';

/**
 * Filter movies based on selected filters
 */
export const filterMovies = <T extends Movie>(
  movies: T[],
  filters: MovieFilters): T[] => {
  return movies.filter((movie) => {
    // Filter by genres
    if (filters.selectedGenres.length > 0) {
      const hasMatchingGenre = filters.selectedGenres.some((genreId) =>
        movie.genre_ids.includes(genreId)
      );
      if (!hasMatchingGenre) return false;
    }

    // Filter by languages
    if (filters.selectedLanguages.length > 0) {
      if (!filters.selectedLanguages.includes(movie.original_language)) {
        return false;
      }
    }

    // Filter by release years
    if (filters.selectedReleaseYears.length > 0) {
      const movieYear = new Date(movie.release_date).getFullYear();
      if (!filters.selectedReleaseYears.includes(movieYear)) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort movies based on sort criteria
 */
export const sortMovies = <T extends Movie>(movies: T[], filters: MovieFilters): T[] => {
  return [...movies].sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case 'popularity':
        comparison = a.popularity - b.popularity;
        break;
      case 'release_date':
        comparison = new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
        break;
      case 'vote_average':
        comparison = a.vote_average - b.vote_average;
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        comparison = 0;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });
};

/**
 * Get available genres from movies
 */
export const getAvailableGenres = (movies: Movie[], allGenres: Genre[]): Genre[] => {
  const usedGenreIds = new Set<number>();
  
  movies.forEach((movie) => {
    movie.genre_ids.forEach((genreId) => {
      usedGenreIds.add(genreId);
    });
  });

  return allGenres.filter((genre) => usedGenreIds.has(genre.id));
};

/**
 * Get available languages from movies
 */
export const getAvailableLanguages = (movies: Movie[], allLanguages: Language[]): Language[] => {
  const usedLanguageCodes = new Set<string>();
  
  movies.forEach((movie) => {
    usedLanguageCodes.add(movie.original_language);
  });

  return allLanguages.filter((language) => usedLanguageCodes.has(language.code));
};

/**
 * Get available release years from movies
 */
export const getAvailableYears = (movies: Movie[]): number[] => {
  const years = new Set<number>();
  
  movies.forEach((movie) => {
    const year = new Date(movie.release_date).getFullYear();
    if (!isNaN(year)) {
      years.add(year);
    }
  });

  return Array.from(years).sort((a, b) => b - a); // Sort descending
};

/**
 * Get count of filtered movies
 */
export const getFilteredMovieCount = (
  movies: Movie[],
  filters: MovieFilters,
): number => {
  const filteredMovies = filterMovies(movies, filters);
  return filteredMovies.length;
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (filters: MovieFilters): boolean => {
  return (
    filters.selectedGenres.length > 0 ||
    filters.selectedLanguages.length > 0 ||
    filters.selectedReleaseYears.length > 0
  );
};

/**
 * Get filter summary string
 */
export const getFilterSummary = (
  filters: MovieFilters,
  availableGenres: Genre[],
  availableLanguages: Language[]
): string => {
  const parts: string[] = [];

  if (filters.selectedGenres.length > 0) {
    const genreNames = filters.selectedGenres
      .map((id) => availableGenres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    if (genreNames) parts.push(genreNames);
  }

  if (filters.selectedLanguages.length > 0) {
    const languageNames = filters.selectedLanguages
      .map((code) => availableLanguages.find((l) => l.code === code)?.name)
      .filter(Boolean)
      .join(', ');
    if (languageNames) parts.push(languageNames);
  }

  if (filters.selectedReleaseYears.length > 0) {
    const years = filters.selectedReleaseYears
      .sort((a, b) => b - a)
      .join(', ');
    parts.push(years);
  }

  return parts.length > 0 ? parts.join(' • ') : 'All movies';
};

/**
 * Get count of active filter selections (genres, languages, years).
 * Sort options are not included in the count.
 */
export const getFilterCount = (filters: MovieFilters): number => {
  const { selectedGenres, selectedLanguages, selectedReleaseYears } = filters;
  return (selectedGenres?.length || 0) + (selectedLanguages?.length || 0) + (selectedReleaseYears?.length || 0);
};

/**
 * Get default filter options from movies
 */
export const getDefaultFilterOptions = (movies: Movie[]): {
  genres: Genre[];
  languages: Language[];
  releaseYears: number[];
} => {
  // This would typically come from an API, but for now we'll generate from movies
  const allGenres: Genre[] = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Horror' },
    { id: 5, name: 'Romance' },
    { id: 6, name: 'Thriller' },
    { id: 7, name: 'Sci-Fi' },
    { id: 8, name: 'Fantasy' },
    { id: 9, name: 'Adventure' },
    { id: 10, name: 'Animation' },
  ];

  const allLanguages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  return {
    genres: getAvailableGenres(movies, allGenres),
    languages: getAvailableLanguages(movies, allLanguages),
    releaseYears: getAvailableYears(movies),
  };
};

/**
 * Apply filters to a list of movies (combines filtering and sorting)
 * @param movies The list of movies to filter
 * @param filters The filters to apply
 * @returns The filtered and sorted list of movies
 */
export const applyFilters = <T extends Movie>(movies: T[], filters: MovieFilters): T[] => {
  // First filter the movies
  const filteredMovies = filterMovies(movies, filters);
  
  // Then sort the filtered movies
  return sortMovies(filteredMovies, filters);
};
