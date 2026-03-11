import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              fontFamily: "'Crimson Text', Georgia, serif",
              color: '#34302b',
              backgroundColor: '#f5f0e6',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontFamily: "'Mansalva', serif", fontSize: '2rem' }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: '1rem', color: '#6b6560' }}>
              The tale hit an unexpected twist.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 2rem',
                backgroundColor: '#3d5a47',
                color: '#faf7f0',
                border: 'none',
                borderRadius: '9999px',
                fontFamily: "'Mansalva', serif",
                fontSize: '1.25rem',
                cursor: 'pointer',
              }}
            >
              Reload
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
