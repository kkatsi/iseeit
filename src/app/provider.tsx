import ErrorBoundary from '@/components/error-boundary';
import type { ReactNode } from 'react';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default AppProvider;
