import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", { email, password });

      const { token, user } = response.data;

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role and onboarding status
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "ngo") {
        navigate(user.onboardingCompleted ? "/ngo-dashboard" : "/ngo-onboarding");
      } else {
        // Volunteer role
        navigate(user.onboardingCompleted ? "/volunteer-dashboard" : "/volunteer-onboarding");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue making a difference"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger p-2 small mb-3" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i> {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-medium">
            Email Address
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light py-1 border-end-0">
              <i className="bi bi-envelope text-muted"></i>
            </span>
            <input
              id="email"
              type="email"
              className="form-control border-start-0 ps-2"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label htmlFor="password" className="form-label fw-medium mb-0">
              Password
            </label>
            {/* <Link to="/forgot-password" className="text-decoration-none small">Forgot password?</Link> */}
          </div>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-lock text-muted"></i>
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-control border-start-0 border-end-0 ps-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="btn btn-outline-none border-start-0 bg-transparent text-muted hover-text-dark"
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

        <button
          type="submit"
          className="btn btn-success bg-gradient w-100 py-2 fw-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="text-center mt-4 text-muted small">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-success text-decoration-none fw-semibold"
          >
            Create one
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
