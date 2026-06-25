import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
const heroImage = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80"; // Placeholder image

const Home = () => {
  const features = [{
    icon: "bi-people",
    title: "Find Volunteers",
    description: "Connect with passionate individuals ready to contribute their time and skills to your cause."
  }, {
    icon: "bi-calendar-event",
    title: "Organize Events",
    description: "Create, manage, and promote volunteer events with our intuitive event management tools."
  }, {
    icon: "bi-building",
    title: "Partner with NGOs",
    description: "Build meaningful partnerships with verified NGOs working on causes you care about."
  }, {
    icon: "bi-heart",
    title: "Make an Impact",
    description: "Track your contributions and see the real difference you're making in your community."
  }];
  
  const stats = [{
    value: "10K+",
    label: "Active Volunteers"
  }, {
    value: "500+",
    label: "NGO Partners"
  }, {
    value: "2K+",
    label: "Events Completed"
  }, {
    value: "50K+",
    label: "Lives Impacted"
  }];

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Hero Section */}
      <section className="position-relative overflow-hidden hero-section p-0 m-0 text-start" style={{ borderRadius: 0 }}>
        {/* Overlay/Gradient handled by hero-section class, but we need custom for Home */}
        <div className="container py-5 my-5">
          <div className="row align-items-center g-5">
            {/* Hero Content */}
            <div className="col-lg-6 text-white position-relative z-index-1">
              <span className="badge bg-white bg-opacity-25 border border-white border-opacity-25 rounded-pill px-3 py-2 mb-4">
                Empowering Communities Together
              </span>
              <h1 className="display-4 fw-bold mb-4 lh-tight">
                Welcome to <br />
                <span className="text-warning position-relative d-inline-block">
                  VolunteerConnect
                  <svg className="position-absolute w-100" style={{ bottom: '-10px', left: 0, height: '8px' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="#ffc107" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="lead mb-5 opacity-90">
                Join hands with NGOs and make a real difference! Our platform connects passionate volunteers with meaningful events and causes.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/register" className="btn btn-warning btn-lg px-4 fw-semibold text-dark">
                  Get Started <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link to="/events" className="btn btn-outline-light btn-lg px-4">
                  Browse Events
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="col-lg-6 d-none d-lg-block position-relative">
              <div className="position-relative rounded-4 overflow-hidden shadow-lg border border-white border-opacity-25" style={{ transform: 'rotate(-2deg)' }}>
                <img src={heroImage} alt="Volunteers working together" className="img-fluid w-100" />
              </div>
              
              {/* Floating Stats Card */}
              <div className="position-absolute bg-white text-dark p-3 rounded-3 shadow-lg d-flex align-items-center gap-3" style={{ bottom: '-30px', left: '-30px', maxWidth: '240px' }}>
                <div className="rounded-circle bg-success bg-opacity-10 p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0">2,500+</h4>
                  <p className="text-muted small mb-0">Events this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="position-absolute bottom-0 start-0 w-100 line-height-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-100" style={{ display: 'block' }}>
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8f9fa" />
          </svg>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row g-4 justify-content-center">
            {stats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3 text-center">
                <div className="p-3">
                  <h2 className="fw-bold text-success display-5 mb-1">{stat.value}</h2>
                  <p className="text-muted fw-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5 mw-100 mx-auto" style={{ maxWidth: '700px' }}>
            <h2 className="fw-bold display-6 mb-3">
              Everything You Need to <span className="text-success">Make a Difference</span>
            </h2>
            <p className="text-muted lead">
              Our platform provides all the tools you need to connect, organize, and create lasting impact.
            </p>
          </div>

          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm card-hover p-4 text-center">
                  <div className="mb-4 bg-success bg-opacity-10 text-success rounded-circle icon-scale mx-auto">
                    <i className={`bi ${feature.icon} fs-2`}></i>
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="hero-section text-center rounded-5 p-5 mx-auto" style={{ maxWidth: '900px' }}>
            <h2 className="fw-bold mb-3 display-6">Ready to Make a Difference?</h2>
            <p className="lead mb-4 opacity-90">
               Join thousands of volunteers and NGOs already making an impact through VolunteerConnect.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/register" className="btn btn-outline-light hover-primary btn-lg px-5 fw-bold">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
