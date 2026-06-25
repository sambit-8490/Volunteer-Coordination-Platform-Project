import React from 'react';
import PropTypes from 'prop-types';

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
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    if (import.meta.env.PROD) {
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                  <h4 className="mb-0">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Something went wrong
                  </h4>
                </div>
                <div className="card-body">
                  <p className="lead">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  
                  {import.meta.env.DEV && this.state.error && (
                    <div className="mt-4">
                      <h5>Error Details (Development Only):</h5>
                      <div className="alert alert-warning">
                        <strong>Error:</strong> {this.state.error.toString()}
                      </div>
                      {this.state.errorInfo && (
                        <details className="mt-3">
                          <summary className="btn btn-sm btn-outline-secondary">
                            Show Component Stack
                          </summary>
                          <pre className="mt-2 p-3 bg-light border rounded">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <button 
                      className="btn btn-primary me-2" 
                      onClick={this.handleReset}
                    >
                      Try Again
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => window.location.href = '/'}
                    >
                      Go to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
