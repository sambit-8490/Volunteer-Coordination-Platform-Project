import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light text-center p-3">
      <div>
        <h1 className="display-1 fw-bold text-dark mb-2">404</h1>
        <p className="lead text-muted mb-4">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="btn btn-success px-4 fw-bold">
          <i className="bi bi-arrow-left me-2"></i> Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
