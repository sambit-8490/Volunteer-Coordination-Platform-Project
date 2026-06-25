import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ isLoggedIn: propIsLoggedIn, userName: propUserName, onLogout: propOnLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn || false);
  const [userName, setUserName] = useState(propUserName || "");
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage if props aren't provided
    if (propIsLoggedIn === undefined) {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUserName(userData.name);
        setUser(userData);
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUser(null);
      }
    } else {
      setIsLoggedIn(propIsLoggedIn);
      setUserName(propUserName);
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      setUser(userData);
    }
  }, [propIsLoggedIn, propUserName, location.pathname]); // Re-check on route change

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (propOnLogout) {
      propOnLogout();
    } else {
      // Default logout logic
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserName("");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light border-bottom sticky-top shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)' }}>
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-center bg-gradient-brand rounded-circle text-white" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-heart-fill"></i>
          </div>
          <div className="d-flex flex-column lh-1">
            <span className="fw-bold fs-5 text-dark">
              Volunteer<span className="text-gradient-brand">Connect</span>
            </span>
            <span className="text-muted text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
              Empowering Communities
            </span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desktop & Mobile Navigation */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <div className="navbar-nav ms-auto align-items-md-center gap-2 mt-3 mt-md-0">
            <Link to="/events" className="text-decoration-none">
              <button className={`btn ${isActive("/events") ? "btn-success" : "ghost"} fw-medium`}>
                Browse Events
              </button>
            </Link>
            
            <Link to="/donate" className="text-decoration-none">
              <button className={`btn ${isActive("/donate") ? "btn-success" : "ghost"} fw-medium d-flex align-items-center gap-1`}>
                <i className="bi bi-heart"></i> Donate
              </button>
            </Link>

            {isLoggedIn ? (
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                
                {/* Dashboard Icon - Desktop Only */}
                <Link 
                  to={
                    user?.role === 'admin' ? '/admin-dashboard' :
                    user?.role === 'ngo' ? '/ngo-dashboard' :
                    '/volunteer-dashboard'
                  }
                  className="text-decoration-none d-none d-md-block"
                >
                  <button className="btn btn-outline-success d-flex align-items-center gap-2">
                    <i className="bi bi-speedometer2"></i>
                    Dashboard
                  </button>
                </Link>
                
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger d-flex align-items-center gap-2"
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column flex-md-row gap-2">
                <Link to="/login" className="text-decoration-none">
                  <button className="btn ghost fw-medium w-100">Login</button>
                </Link>
                <Link to="/register" className="text-decoration-none">
                  <button className="btn btn-success fw-medium w-100 border-0">Register</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
