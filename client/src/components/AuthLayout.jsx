import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="d-flex min-vh-100 row g-0">
      {/* Left Side - Branding */}
      <div className="d-none d-lg-flex col-lg-6 gradient-hero flex-column align-items-center justify-content-center p-5 text-white text-center">
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-center bg-white bg-opacity-25 rounded-circle mb-4 mx-auto" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-heart-fill fs-1 text-white"></i>
          </div>
          <h1 className="fw-bold display-5 mb-3">VolunteerConnect</h1>
          <p className="lead opacity-75">
            Join hands with NGOs and make a real difference! Connect with passionate volunteers and meaningful causes.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="d-flex col-12 col-lg-6 flex-column align-items-center justify-content-center bg-white">
        {/* Mobile Header */}
        <div className="d-lg-none w-100 py-2 border-bottom d-flex align-items-center justify-content-center gap-2 mb-4" style={{ minHeight: '30px' }}>
          <div className="bg-success rounded p-1 text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-heart-fill small"></i>
          </div>
           <span className="fw-bold fs-5 text-dark">
              Volunteer<span className="text-gradient-brand">Connect</span>
            </span>
        </div>

        {/* Form Container */}
        <div className="w-100 p-4" style={{ maxWidth: '450px' }}>
          <div className="text-center text-lg-start mb-4">
            <h2 className="fw-bold mb-2">{title}</h2>
            <p className="text-muted">{subtitle}</p>
          </div>

          {children}

          <div className="text-center mt-4 d-lg-none">
            <Link to="/" className="text-decoration-none text-success">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
