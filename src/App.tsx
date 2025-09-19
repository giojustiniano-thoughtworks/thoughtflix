import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { ReduxProvider } from './components/ReduxProvider/ReduxProvider';
import { QueryProvider } from './components/QueryProvider/QueryProvider';
import './index.css';

/**
 * Main App component with routing, Redux, and React Query setup
 */
function App() {
  return (
    <QueryProvider>
      <ReduxProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRouter />
        </BrowserRouter>
      </ReduxProvider>
    </QueryProvider>
  );
}

export default App;
