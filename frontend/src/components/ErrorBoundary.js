import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="container" style={{ 
          maxWidth: '600px', 
          margin: '100px auto', 
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            animation: 'spin 2s linear infinite'
          }}>
            😵
          </div>
          <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
            We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </p>
          
          {this.state.error && (
            <details style={{ 
              textAlign: 'left', 
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '30px',
              cursor: 'pointer'
            }}>
              <summary style={{ fontWeight: 'bold', color: '#333' }}>
                Error Details (for developers)
              </summary>
              <p style={{ color: '#dc3545', marginTop: '10px' }}>
                {this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <pre style={{ 
                  overflow: 'auto', 
                  fontSize: '12px',
                  backgroundColor: '#f1f1f1',
                  padding: '10px',
                  borderRadius: '5px'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh Page
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/'}
            >
              🏠 Go to Home
            </button>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;