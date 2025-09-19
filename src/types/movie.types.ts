// Movie types for homepage components
import { type BaseComponentProps, type ClickableComponentProps, type ErrorComponentProps, type LoadingComponentProps, type SizableComponentProps } from './common.types';

export interface Movie {
  id: string | number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieSection {
  title: string;
  movies: Movie[];
  type: 'big_hits' | 'recently_released' | 'top_rated' | 'trending';
}

export interface HeroMovie extends Movie {
  backdrop_path: string;
  tagline?: string;
}

export interface HomePageData {
  heroMovie: HeroMovie | null;
  sections: MovieSection[];
}

export interface MovieCardProps extends ClickableComponentProps<Movie>, SizableComponentProps {
  /** Movie data to display */
  readonly movie: Movie;
  /** Style variant of the card */
  readonly variant?: 'default' | 'large' | 'small';
}

export interface MovieSectionProps extends BaseComponentProps {
  /** Section title */
  readonly title: string;
  /** Movies to display in the section */
  readonly movies: Movie[];
  /** Type of the movie section */
  readonly type: MovieSection['type'];
  /** Callback function called when a movie is clicked */
  readonly onMovieClick?: (movie: Movie) => void;
}

export interface HeroSectionProps extends BaseComponentProps {
  /** Hero movie data to display */
  readonly movie?: HeroMovie | null;
  /** Callback function called when play button is clicked */
  readonly onPlayClick?: (movie?: HeroMovie | null) => void;
  /** Callback function called when more info button is clicked */
  readonly onMoreInfoClick?: (movie?: HeroMovie | null) => void;
}

export interface NavigationProps extends BaseComponentProps {
  /** Callback function called when search is performed */
  readonly onSearch?: (query: string) => void;
  /** Callback function called when search is cleared */
  readonly onClearSearch?: () => void;
  /** Current active section */
  readonly currentSection?: string;
  /** Whether search is currently active */
  readonly isSearchActive?: boolean;
  /** Number of search results */
  readonly searchResultCount?: number;
}

export interface MovieDetailsPageProps {
  movieId: string;
  onBack?: () => void;
  onPlayClick?: (movie: MovieDetails) => void;
  onMoreInfoClick?: (movie: MovieDetails) => void;
  onNavigate?: (section: string) => void;
  onSearch?: (query: string) => void;
}

export interface MovieDetailsDisplayProps {
  movie?: MovieDetails | null;
  loading?: boolean;
  error?: string | null;
  onBack?: () => void;
  onPlayClick?: (movie: MovieDetails) => void;
  onMoreInfoClick?: (movie: MovieDetails) => void;
  onRetry?: () => void;
}

// ============================================================================
// MOVIE FILTERING TYPES
// ============================================================================

export interface MovieFilterOptions {
  genres: Genre[];
  languages: Language[];
  releaseYears: number[];
}

export interface Language {
  code: string;
  name: string;
}

export interface MovieFilters {
  selectedGenres: number[];
  selectedLanguages: string[];
  selectedReleaseYears: number[];
  sortBy: 'popularity' | 'release_date' | 'vote_average' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface FilterState {
  isOpen: boolean;
  filters: MovieFilters;
  availableOptions: MovieFilterOptions;
}

export interface MovieFilterProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: MovieFilters;
  availableOptions: MovieFilterOptions;
  onFiltersChange?: (filters: MovieFilters) => void;
  onClearFilters?: () => void;
  onApplyFilters?: () => void;
  resultCount: number;
}

export interface GenreFilterProps {
  genres: Genre[];
  selectedGenres: number[];
  onGenreToggle?: (genreId: number) => void;
  onSelectAll?: () => void;
  onClearAll?: () => void;
}

export interface LanguageFilterProps {
  languages: Language[];
  selectedLanguages: string[];
  onLanguageToggle?: (languageCode: string) => void;
  onSelectAll?: () => void;
  onClearAll?: () => void;
}

export interface YearFilterProps {
  years: number[];
  selectedYears: number[];
  onYearToggle?: (year: number) => void;
  onSelectAll?: () => void;
  onClearAll?: () => void;
}

export interface SortFilterProps {
  sortBy: MovieFilters['sortBy'];
  sortOrder: MovieFilters['sortOrder'];
  onSortChange?: (sortBy: MovieFilters['sortBy']) => void;
  onOrderChange?: (sortOrder: MovieFilters['sortOrder']) => void;
}

export interface FilterButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

export interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  onClearAll?: () => void;
  hasSelection?: boolean;
}

export interface SearchResultsProps extends ErrorComponentProps, LoadingComponentProps {
  /** Search query string */
  readonly searchQuery: string;
  /** Movies to display in search results */
  readonly movies?: Movie[];
  /** Callback function called when a movie is clicked */
  readonly onMovieClick: (movie: Movie) => void;
  /** Callback function called when back to home is clicked */
  readonly onBackToHome: () => void;
  /** Current movie filters */
  readonly filters?: MovieFilters;
}
