import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Redux Provider component that wraps the app with Redux store
 */
export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
