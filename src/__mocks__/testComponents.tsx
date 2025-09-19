import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { NavigationWrapper } from '../components/NavigationWrapper/NavigationWrapper';
import { createQueryClient, createTestStore } from './testUtils';

// ============================================================================
// TEST WRAPPER COMPONENTS
// ============================================================================

// Helper functions moved to testUtils.ts to avoid React Refresh issues

export const QueryWrapper: React.FC<{ children: React.ReactNode; queryClient?: QueryClient }> = ({ 
  children, 
  queryClient = createQueryClient() 
}) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

export const ReduxWrapper: React.FC<{ children: React.ReactNode; store?: ReturnType<typeof createTestStore> }> = ({ 
  children, 
  store = createTestStore() 
}) => (
  <Provider store={store}>
    {children}
  </Provider>
);

export const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    {children}
  </MemoryRouter>
);

export const FullTestWrapper: React.FC<{ 
  children: React.ReactNode; 
  queryClient?: QueryClient;
  store?: ReturnType<typeof createTestStore>;
}> = ({ 
  children, 
  queryClient = createQueryClient(),
  store = createTestStore()
}) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
      </MemoryRouter>
    </Provider>
  </QueryClientProvider>
);
