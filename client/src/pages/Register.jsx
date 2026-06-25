import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import AuthLayout from "@/components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer", // default role
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/register", formData);

      const { token, user } = response.data;

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to role-based onboarding
      if (user.role === "ngo") {
        navigate("/ngo-onboarding");
      } else {
        navigate("/volunteer-onboarding");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join us to start your volunteering journey"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger p-2 small mb-3" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i> {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-medium">
            Full Name
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-person text-muted"></i>
            </span>
            <input
              id="name"
              className="form-control border-start-0 ps-2"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-medium">
            Email Address
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-envelope text-muted"></i>
            </span>
            <input
              id="email"
              className="form-control border-start-0 ps-2"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-medium">
            Password
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-lock text-muted"></i>
            </span>
            <input
              id="password"
              className="form-control border-start-0 border-end-0 ps-2"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              className="btn btn-outline-secondary border-start-0 bg-transparent hover-text-dark"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ borderColor: "var(--bs-border-color)" }}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="form-label fw-medium">
            I want to join as
          </label>
          <select
            id="role"
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO Partner</option>
          </select>
        </div>

        <button
          className="btn btn-success w-100 py-2 fw-semibold"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Creating Account...
            </>
          ) : (
            "Register"
          )}
        </button>

        <div className="text-center mt-4 text-muted small">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-success text-decoration-none fw-semibold"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
