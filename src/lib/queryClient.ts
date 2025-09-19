import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Query keys for consistent cache management
 */
export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    popular: () => [...queryKeys.movies.all, 'popular'] as const,
    topRated: () => [...queryKeys.movies.all, 'topRated'] as const,
    upcoming: () => [...queryKeys.movies.all, 'upcoming'] as const,
    search: (query: string, page?: number) => 
      [...queryKeys.movies.all, 'search', { query, page }] as const,
    details: (id: string) => [...queryKeys.movies.all, 'details', id] as const,
  },
  homePage: {
    all: ['homePage'] as const,
    data: () => [...queryKeys.homePage.all, 'data'] as const,
  },
} as const;
