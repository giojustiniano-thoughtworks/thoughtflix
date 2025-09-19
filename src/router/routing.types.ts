import { type ComponentType } from 'react';

/**
 * Route configuration interface
 */
export interface RouteConfig {
  path: string;
  component: ComponentType<Record<string, unknown>>;
  exact?: boolean;
  title: string;
  description?: string;
  isProtected?: boolean;
  roles?: string[];
}

/**
 * Navigation item interface
 */
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  isActive?: boolean;
  children?: NavigationItem[];
}

/**
 * Route parameters interface
 */
export interface RouteParams {
  [key: string]: string | undefined;
}

/**
 * Route query parameters interface
 */
export interface RouteQuery {
  [key: string]: string | string[] | undefined;
}

/**
 * Route location interface
 */
export interface RouteLocation {
  pathname: string;
  search: string;
  hash: string;
  state?: Record<string, unknown>;
  key?: string;
}

/**
 * Route match interface
 */
export interface RouteMatch {
  params: RouteParams;
  isExact: boolean;
  path: string;
  url: string;
}

/**
 * Route context interface
 */
export interface RouteContext {
  location: RouteLocation;
  match: RouteMatch;
  history: {
    push: (path: string, state?: Record<string, unknown>) => void;
    replace: (path: string, state?: Record<string, unknown>) => void;
    goBack: () => void;
    goForward: () => void;
  };
}

/**
 * Route guard interface
 */
export interface RouteGuard {
  canActivate: (context: RouteContext) => boolean | Promise<boolean>;
  redirectTo?: string;
}

/**
 * Route configuration for the application
 */
export const ROUTES = {
  HOME: '/',
  MOVIES: '/movies',
  TV_SHOWS: '/tv-shows',
  NEW_POPULAR: '/new-popular',
  MY_LIST: '/my-list',
  SEARCH: '/search',
  MOVIE_DETAILS: '/movie/:id',
  TV_SHOW_DETAILS: '/tv/:id',
  NOT_FOUND: '/404',
} as const;

/**
 * Type for route keys
 */
export type RouteKey = keyof typeof ROUTES;

/**
 * Navigation items configuration
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: ROUTES.HOME,
    icon: '🏠',
  },
  {
    id: 'tv-shows',
    label: 'TV Shows',
    path: ROUTES.TV_SHOWS,
    icon: '📺',
  },
  {
    id: 'movies',
    label: 'Movies',
    path: ROUTES.MOVIES,
    icon: '🎬',
  },
  {
    id: 'new-popular',
    label: 'New & Popular',
    path: ROUTES.NEW_POPULAR,
    icon: '⭐',
  },
  {
    id: 'my-list',
    label: 'My List',
    path: ROUTES.MY_LIST,
    icon: '📋',
  },
];

/**
 * Route titles mapping
 */
export const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: 'ThoughtFlix - Home',
  [ROUTES.MOVIES]: 'ThoughtFlix - Movies',
  [ROUTES.TV_SHOWS]: 'ThoughtFlix - TV Shows',
  [ROUTES.NEW_POPULAR]: 'ThoughtFlix - New & Popular',
  [ROUTES.MY_LIST]: 'ThoughtFlix - My List',
  [ROUTES.SEARCH]: 'ThoughtFlix - Search',
  [ROUTES.MOVIE_DETAILS]: 'ThoughtFlix - Movie Details',
  [ROUTES.NOT_FOUND]: 'ThoughtFlix - Page Not Found',
};
