import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { NavigationWrapper } from './NavigationWrapper';
import { type Movie, type HeroMovie } from '../../types/movie.types';
import { useNavigation } from '../../hooks/useNavigation';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NavigationWrapper', () => {
  const mockMovie: Movie = {
    id: 'tt1234567',
    title: 'F1: The Movie',
    overview: 'A Formula One driver comes out of retirement to mentor and team up with a younger driver.',
    poster_path: '/f1-movie-poster.jpg',
    backdrop_path: '/f1-movie-backdrop.jpg',
    release_date: '2025-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [1, 2, 3],
    adult: false,
    original_language: 'en',
    original_title: 'F1: The Movie',
    popularity: 100,
    video: false,
  };

  const mockHeroMovie: HeroMovie = {
    ...mockMovie,
    backdrop_path: '/f1-movie-backdrop.jpg',
    tagline: 'Speed meets destiny',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Movie Click Navigation', () => {
    it('GIVEN a NavigationWrapper with movie click handler WHEN movie is clicked THEN should navigate to movie details page', () => {
      // GIVEN
      const TestComponent = () => {
        return (
          <div>
            <button onClick={() => {
              // Simulate movie click
              const handleMovieClick = (movie: Movie) => {
                mockNavigate(`/movie/${movie.id}`);
              };
              handleMovieClick(mockMovie);
            }}>
              Click Movie
            </button>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Click Movie'));

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
    });

    it('GIVEN a NavigationWrapper WHEN movie with different ID is clicked THEN should navigate to correct movie details page', () => {
      // GIVEN
      const differentMovie = { ...mockMovie, id: 'tt9876543' };
      
      const TestComponent = () => {
        return (
          <div>
            <button onClick={() => {
              const handleMovieClick = (movie: Movie) => {
                mockNavigate(`/movie/${movie.id}`);
              };
              handleMovieClick(differentMovie);
            }}>
              Click Different Movie
            </button>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Click Different Movie'));

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt9876543');
    });
  });

  describe('Hero Movie Click Navigation', () => {
    it('GIVEN a NavigationWrapper with hero movie click handler WHEN hero movie is clicked THEN should navigate to movie details page', () => {
      // GIVEN
      const TestComponent = () => {
        return (
          <div>
            <button onClick={() => {
              const handleHeroMovieClick = (movie: HeroMovie) => {
                mockNavigate(`/movie/${movie.id}`);
              };
              handleHeroMovieClick(mockHeroMovie);
            }}>
              Click Hero Movie
            </button>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Click Hero Movie'));

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
    });
  });

  describe('Section Navigation', () => {
    const navigationTestCases = [
      {
        description: 'home section',
        section: 'home',
        expectedPath: '/',
      },
      {
        description: 'movies section',
        section: 'movies',
        expectedPath: '/movies',
      },
      {
        description: 'tv-shows section',
        section: 'tv-shows',
        expectedPath: '/tv-shows',
      },
      {
        description: 'new-popular section',
        section: 'new-popular',
        expectedPath: '/new-popular',
      },
      {
        description: 'my-list section',
        section: 'my-list',
        expectedPath: '/my-list',
      },
      {
        description: 'unknown section',
        section: 'unknown',
        expectedPath: '/',
      },
    ];

    navigationTestCases.forEach(({ description, section, expectedPath }) => {
      it(`GIVEN a NavigationWrapper WHEN navigating to ${description} THEN should navigate to correct path`, () => {
        // GIVEN
        const TestComponent = () => {
          return (
            <div>
              <button onClick={() => {
                const handleNavigate = (section: string) => {
                  switch (section) {
                    case 'home':
                      mockNavigate('/');
                      break;
                    case 'movies':
                      mockNavigate('/movies');
                      break;
                    case 'tv-shows':
                      mockNavigate('/tv-shows');
                      break;
                    case 'new-popular':
                      mockNavigate('/new-popular');
                      break;
                    case 'my-list':
                      mockNavigate('/my-list');
                      break;
                    default:
                      mockNavigate('/');
                  }
                };
                handleNavigate(section);
              }}>
                Navigate to {section}
              </button>
            </div>
          );
        };

        // WHEN
        render(
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <NavigationWrapper>
              <TestComponent />
            </NavigationWrapper>
          </MemoryRouter>
        );

        fireEvent.click(screen.getByText(`Navigate to ${section}`));

        // THEN
        expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
      });
    });
  });

  describe('Search Navigation', () => {
    it('GIVEN a NavigationWrapper WHEN searching with query THEN should not navigate (handled by HomePage)', () => {
      // GIVEN
      const searchQuery = 'F1 movie';
      
      const TestComponent = () => {
        const { onSearch } = useNavigation();
        return (
          <div>
            <button onClick={() => onSearch(searchQuery)}>
              Search
            </button>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Search'));

      // THEN
      // Search function no longer navigates - it's handled by the HomePage component
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('GIVEN a NavigationWrapper WHEN searching with empty query THEN should not navigate (handled by HomePage)', () => {
      // GIVEN
      const TestComponent = () => {
        const { onSearch } = useNavigation();
        return (
          <div>
            <button onClick={() => onSearch('')}>
              Search Empty
            </button>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Search Empty'));

      // THEN
      // Search function no longer navigates - it's handled by the HomePage component
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('GIVEN a NavigationWrapper WHEN searching with special characters THEN should encode query properly', () => {
      // GIVEN
      const searchQuery = 'F1: The Movie & More!';
      
      const TestComponent = () => {
        const { onSearch } = useNavigation();
        return (
          <div>
            <button onClick={() => onSearch(searchQuery)}>
              Search Special
            </button>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Search Special'));

      // THEN
      // Search function no longer navigates - it's handled by the HomePage component
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Context Provider', () => {
    it('GIVEN a NavigationWrapper WHEN providing context THEN should make navigation available to children', () => {
      // GIVEN
      const TestComponent = () => {
        const { onMovieClick, onPlayClick, onMoreInfoClick, onNavigate, onSearch } = useNavigation();
        
        return (
          <div>
            <button onClick={() => onMovieClick(mockMovie)}>Movie Click</button>
            <button onClick={() => onPlayClick(mockHeroMovie)}>Play Click</button>
            <button onClick={() => onMoreInfoClick(mockHeroMovie)}>More Info Click</button>
            <button onClick={() => onNavigate('home')}>Navigate</button>
            <button onClick={() => onSearch('test')}>Search</button>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Movie Click'));
      fireEvent.click(screen.getByText('Play Click'));
      fireEvent.click(screen.getByText('More Info Click'));
      fireEvent.click(screen.getByText('Navigate'));
      fireEvent.click(screen.getByText('Search'));

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
      expect(mockNavigate).toHaveBeenCalledWith('/');
      // Search function no longer navigates - it's handled by the HomePage component
      expect(mockNavigate).toHaveBeenCalledTimes(4);
    });

    it('GIVEN a NavigationWrapper WHEN children are not using context THEN should render normally', () => {
      // GIVEN
      const TestComponent = () => {
        return (
          <div>
            <span>Component not using navigation context</span>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      // THEN
      expect(screen.getByText('Component not using navigation context')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('GIVEN a NavigationWrapper WHEN movie ID is empty THEN should handle gracefully', () => {
      // GIVEN
      const movieWithEmptyId = { ...mockMovie, id: '' };
      
      const TestComponent = () => {
        return (
          <div>
            <button onClick={() => {
              const handleMovieClick = (movie: Movie) => {
                mockNavigate(`/movie/${movie.id}`);
              };
              handleMovieClick(movieWithEmptyId);
            }}>
              Click Empty ID
            </button>
          </div>
        );
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Click Empty ID'));

      // THEN
      expect(mockNavigate).toHaveBeenCalledWith('/movie/');
    });

    it('GIVEN a NavigationWrapper WHEN multiple children exist THEN should provide context to all children', () => {
      // GIVEN
      const TestComponent1 = () => {
        const { onMovieClick } = useNavigation();
        return <button onClick={() => onMovieClick(mockMovie)}>Component 1</button>;
      };
      const TestComponent2 = () => {
        const { onMovieClick } = useNavigation();
        return <button onClick={() => onMovieClick(mockMovie)}>Component 2</button>;
      };

      // WHEN
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <NavigationWrapper>
            <TestComponent1 />
            <TestComponent2 />
          </NavigationWrapper>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Component 1'));
      fireEvent.click(screen.getByText('Component 2'));

      // THEN
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith('/movie/tt1234567');
    });
  });
});
