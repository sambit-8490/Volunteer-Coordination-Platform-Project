import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-top bg-white">
      {/* Main Footer Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand & Description */}
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center justify-content-center bg-gradient-brand rounded-lg text-white" style={{ width: '40px', height: '40px', borderRadius: '8px' }}>
                <i className="bi bi-heart-fill"></i>
              </div>
              <span className="fw-bold fs-5 text-dark">Volunteer<span className="text-gradient-brand">Connect</span></span>
            </div>
            <p className="text-muted mb-0 w-75">
              Empowering communities by connecting passionate volunteers with meaningful opportunities. Together, we create lasting change.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5 className="fw-semibold text-dark mb-3">Quick Links</h5>
            <div className="d-flex flex-column gap-2">
              <Link to="/events" className="text-decoration-none text-muted hover-primary">
                Browse Events
              </Link>
              <Link to="/about" className="text-decoration-none text-muted hover-primary">
                About Us
              </Link>
              <Link to="/register" className="text-decoration-none text-muted hover-primary">
                Become a Volunteer
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h5 className="fw-semibold text-dark mb-3">Contact Us</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2 text-muted">
                <i className="bi bi-envelope text-success"></i>
                <span>hello@volunteerconnect.org</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <i className="bi bi-telephone text-success"></i>
                <span>+91 123-456-7890</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <i className="bi bi-geo-alt text-success"></i>
                <span>123, Hi-Tech City, Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-top bg-light py-3">
        <div className="container">
          <p className="text-center text-muted small mb-0">
            © {currentYear} VolunteerConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
