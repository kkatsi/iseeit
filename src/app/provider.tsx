import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import ErrorBoundary from '@/components/error-boundary';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>{children}</BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppProvider;
