import { createContext, useContext } from 'react';
import { type Movie, type HeroMovie } from '../../types/movie.types';

// Create navigation context
interface NavigationContextType {
  onMovieClick: (movie: Movie) => void;
  onPlayClick: (movie: HeroMovie) => void;
  onMoreInfoClick: (movie: HeroMovie) => void;
  onNavigate: (section: string) => void;
  onSearch: (query: string) => void;
}

export const NavigationContext = createContext<NavigationContextType | null>(null);

// Hook to use navigation context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationWrapper');
  }
  return context;
};
