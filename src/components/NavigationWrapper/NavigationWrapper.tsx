import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Movie, type HeroMovie } from '../../types/movie.types';
import { NavigationContext } from '../../hooks/useNavigation';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

/**
 * NavigationWrapper component that provides navigation functionality
 * to child components through context or props
 */
export const NavigationWrapper: React.FC<NavigationWrapperProps> = ({ children }) => {
  const navigate = useNavigate();

  // Handle movie click navigation
  const handleMovieClick = (movie: Movie) => {
    // Navigate to movie details page using the movie ID
    navigate(`/movie/${movie.id}`);
  };

  // Handle hero movie play click
  const handlePlayClick = (movie: HeroMovie) => {
    // For now, navigate to movie details page
    // In a real app, this might open a video player or start streaming
    navigate(`/movie/${movie.id}`);
  };

  // Handle hero movie more info click
  const handleMoreInfoClick = (movie: HeroMovie) => {
    // Navigate to movie details page for more information
    navigate(`/movie/${movie.id}`);
  };

  // Handle navigation to different sections
  const handleNavigate = (section: string) => {
    switch (section) {
      case 'home':
        navigate('/');
        break;
      case 'movies':
        navigate('/movies');
        break;
      case 'tv-shows':
        navigate('/tv-shows');
        break;
      case 'new-popular':
        navigate('/new-popular');
        break;
      case 'my-list':
        navigate('/my-list');
        break;
      default:
        navigate('/');
    }
  };

  // Handle search navigation
  const handleSearch = () => {
    // For now, just stay on the current page and let the HomePage handle the search
    // The search state is managed by the HomePage component itself
    // This prevents the 404 redirect issue
  };

  // Provide navigation handlers through context
  const navigationValue = {
    onMovieClick: handleMovieClick,
    onPlayClick: handlePlayClick,
    onMoreInfoClick: handleMoreInfoClick,
    onNavigate: handleNavigate,
    onSearch: handleSearch,
  };

  return (
    <NavigationContext.Provider value={navigationValue}>
      {children}
    </NavigationContext.Provider>
  );
};
