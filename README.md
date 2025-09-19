# ThoughtFlix - Movie Discovery Application

A modern React TypeScript application for discovering movies with real-time data from multiple movie APIs. Built with React 19, TypeScript, Redux Toolkit, React Query, and Vitest for a robust, scalable movie discovery experience.

_This is a Thoughtworks study project resulting from a hands-on learning experience of the best practices regarding AI For Software Development_

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Testing**: Vitest with Testing Library
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **API Integration**: OMDb API

## Project Structure

```
src/
├── components/        # Reusable React components
│   ├── FilterButton/     # Filter button component
│   ├── FilterDropdown/   # Filter dropdown component
│   ├── FilterSection/    # Filter section wrapper
│   ├── GenreFilter/      # Genre filtering component
│   ├── HeroSection/      # Hero section component
│   ├── LanguageFilter/   # Language filtering component
│   ├── MovieCard/        # Movie card component
│   ├── MovieFilter/      # Movie filter modal
│   ├── MovieSection/     # Movie section component
│   ├── Navigation/       # Navigation component
│   ├── NavigationWrapper/ # Navigation context provider
│   ├── QueryProvider/    # React Query provider
│   ├── ReduxProvider/    # Redux store provider
│   ├── SearchBar/        # Search input component
│   ├── SearchResults/    # Search results display
│   ├── SortFilter/       # Sort filtering component
│   └── YearFilter/       # Year filtering component
├── config/            # Configuration files
│   ├── api.config.ts     # API configuration
│   └── api.config.test.ts
├── hooks/             # Custom React hooks
│   ├── redux.hooks/      # Redux-related hooks
│   ├── useMoviesQuery/   # Movie data fetching hooks
│   ├── useNavigation/    # Navigation context and hooks
│   └── useOptimizedCallbacks/ # Performance optimization hooks
├── lib/               # Library configurations
│   └── queryClient.ts    # React Query client setup
├── pages/             # Page components
│   ├── HomePage/         # Home page component
│   ├── MovieDetailsPage/ # Movie details page
│   └── NotFoundPage/     # 404 error page
├── router/            # Routing configuration
│   ├── AppRouter/        # Main router component
│   └── routing.types.ts  # Route type definitions
├── services/          # API service layer
│   ├── ApiService/       # Base API service
│   └── OMDbService/      # OMDb API service
├── store/             # Redux store
│   └── slices/           # Redux slices
│       ├── filterSlice/    # Filter state management
│       ├── moviesSlice/    # Movie data management
│       └── uiSlice/        # UI state management
├── types/             # TypeScript type definitions
│   ├── api.types.ts      # API-related types
│   ├── common.types.ts   # Common component props and base types
│   ├── movie.types.ts    # Movie and component types
│   ├── omdb.types.ts     # OMDb API specific types
│   ├── query.types.ts    # React Query types
│   ├── redux.types.ts    # Redux state types
│   └── service.types.ts  # Service architecture types
├── utils/             # Utility functions
│   ├── dataTransformers/ # Data transformation utilities
│   ├── filterUtils/      # Filtering utilities
│   └── queryUtils/       # Query-related utilities
├── __mocks__/         # Test mocks and utilities
│   ├── testComponents.tsx # Test wrapper components
│   ├── testData.ts       # Mock test data
│   ├── testMocks.tsx     # Common test mocks
│   ├── testUtils.ts      # Test utility functions
│   └── vite-env.ts       # Vite environment types
├── App.tsx            # Main App component
├── main.tsx           # Application entry point
├── setupTests.ts      # Vitest test setup
└── vite-env.d.ts      # Vite type definitions
```

## Folder Organization

The project follows a **co-location pattern** where each component, service, and page has its own folder containing all related files:

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Page-level components in `src/pages/`
- **Services**: API services in `src/services/`
- **Types**: Shared TypeScript definitions in `src/types/`

Each folder contains:
- Main component/service file (`.tsx` or `.ts`)
- Test file (`.test.tsx` or `.test.ts`)
- Styles file (`.css`)
- Index file (`index.ts`) for clean imports

This organization makes it easy to:
- Find all files related to a specific feature
- Maintain and refactor components
- Understand dependencies at a glance
- Scale the application with new features

## Services Architecture

### ApiService

The `ApiService` class is the foundation for all API interactions in the application. It provides:

- **Generic HTTP methods**: GET, POST, PUT, DELETE, PATCH
- **Error handling**: Consistent error formatting across all API calls
- **Request/Response interceptors**: For common functionality like authentication
- **Configuration management**: Dynamic base URL and header updates
- **TypeScript support**: Fully typed requests and responses

### OMDbService

The `OMDbService` extends `ApiService` to provide OMDb API functionality:

- **Search Movies**: Search for movies by title with optional filters
- **Get Movie by Title**: Retrieve detailed movie information by title
- **Get Movie by IMDb ID**: Retrieve detailed movie information by IMDb ID
- **Error Handling**: Comprehensive error handling for all OMDb API responses
- **Type Safety**: Full TypeScript support with OMDb-specific types

### RapidAPIMovieService

The `RapidAPIMovieService` extends `ApiService` to provide The Movie Database (TMDB) functionality:

- **Search Movies**: Search for movies with advanced filtering options
- **Get Popular Movies**: Retrieve currently popular movies
- **Get Top Rated Movies**: Retrieve highest-rated movies
- **Get Upcoming Movies**: Retrieve upcoming movie releases
- **Get Movie Details**: Retrieve detailed movie information by ID
- **Error Handling**: Comprehensive error handling for all TMDB API responses
- **Type Safety**: Full TypeScript support with TMDB-specific types

### Key Features

- **Test-Driven Development**: All services are built with comprehensive test coverage
- **Gherkin Syntax**: Tests written in Given-When-Then format for clarity
- **Error Handling**: Robust error handling for network, server, and unknown errors
- **Type Safety**: Full TypeScript support with proper interfaces
- **Mocking**: Vitest-based mocking for reliable unit tests

## Features

### 🎬 Movie Discovery
- **Trending Movies**: Display popular and trending movies on the homepage
- **Movie Search**: Real-time search with debounced input for optimal performance
- **Movie Details**: Comprehensive movie information with ratings, cast, and plot
- **Responsive Design**: Mobile-first design that works across all devices

### 🔍 Advanced Filtering
- **Genre Filtering**: Filter movies by multiple genres
- **Language Filtering**: Filter by original language
- **Year Filtering**: Filter by release year
- **Sort Options**: Sort by popularity, rating, release date, and more
- **Search Results**: Apply filters to search results for refined discovery

### 🎨 User Experience
- **Netflix-style UI**: Modern, intuitive interface inspired by Netflix
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Proper loading indicators and error handling
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Performance**: Optimized with React.memo, useCallback, and useMemo

### 🧪 Testing & Quality
- **Comprehensive Testing**: 573 tests with 100% component coverage
- **TDD Approach**: Test-driven development with Gherkin syntax
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Performance Testing**: Optimized components with performance monitoring

## API Integration

The application integrates with:

- **OMDb API**: https://www.omdbapi.com/ - For detailed movie information and search
- **Future**: Ready for additional movie APIs (TMDB, etc.)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd thoughtflix

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ui      # Run tests with UI

# Code Quality
npm run lint         # Run ESLint
```

## Testing

The application uses **Vitest** for testing with comprehensive coverage:

- **573 tests** across all components and utilities
- **TDD approach** with Gherkin syntax (Given-When-Then)
- **100% component coverage** for critical user flows
- **Integration tests** for user interactions
- **Unit tests** for utilities and hooks
- **Mocking** with Vitest for reliable testing

## Architecture

### State Management
- **Redux Toolkit**: Global state management for UI and movie data
- **React Query**: Server state management and caching
- **Context API**: Component-level state sharing

### Component Architecture
- **Atomic Design**: Reusable components with clear responsibilities
- **Custom Hooks**: Logic separation and reusability
- **Performance Optimization**: React.memo, useCallback, useMemo
- **TypeScript**: Full type safety throughout the application

### Testing Strategy
- **Unit Tests**: Individual component and utility testing
- **Integration Tests**: User interaction and data flow testing
- **Mocking**: Comprehensive mocking for external dependencies
- **Coverage**: 100% coverage for critical user paths

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.