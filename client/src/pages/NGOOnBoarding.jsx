import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useToast } from "../context/ToastContext";

const NGOOnboarding = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isSubmitting = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    mission: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    website: "",
  });

  const handleCreateSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/ngo/register", {
        name: formData.name,
        category: formData.category,
        mission: formData.mission,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        website: formData.website,
      });

      if (response.data.success) {
        // Update user in localStorage to reflect onboarding completion
        const user = JSON.parse(localStorage.getItem("user"));
        user.onboardingCompleted = true;
        localStorage.setItem("user", JSON.stringify(user));

        showToast("NGO registered successfully! Your application is pending approval.", "success");
        navigate("/ngo-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register NGO");
      isSubmitting.current = false; // Reset on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5 d-flex align-items-center">
      <div className="container" style={{ maxWidth: '700px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle text-white mb-3"
               style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #20c997 0%, #198754 100%)' }}>
             <i className="bi bi-building fs-1"></i>
          </div>
          <h1 className="fw-bold mb-2">Register Your NGO</h1>
          <p className="text-muted">
            Set up your organization and start creating events
          </p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i> {error}
          </div>
        )}

        {/* Step 1 — Basic Information */}
        {step === 1 && (
          <div className="card shadow-sm border-0 fade-in-up">
            <div className="card-header p-4 border-0" style={{ background: 'linear-gradient(135deg, #20c997 0%, #198754 100%)' }}>
               <div className="d-flex align-items-center gap-2 mb-1 text-white">
                 <i className="bi bi-file-text fs-5"></i>
                 <h4 className="fw-bold mb-0">Basic Information</h4>
               </div>
               <p className="mb-0 text-white opacity-75 small">Tell us about your organization</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">Organization Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="e.g., Hope Foundation"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="environment">Environment</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="food">Food Security</option>
                    <option value="elderly">Elder Care</option>
                    <option value="animals">Animal Welfare</option>
                    <option value="disaster">Disaster Relief</option>
                    <option value="community">Community Development</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="mission" className="form-label fw-semibold">Mission Statement</label>
                  <textarea
                    className="form-control"
                    id="mission"
                    rows="3"
                    placeholder="Describe your organization's mission and goals..."
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="4"
                    placeholder="Tell volunteers about your work and impact..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-grow-1"
                    onClick={() => navigate("/ngo-dashboard")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    style={{ background: 'linear-gradient(135deg, #20c997 0%, #198754 100%)', border: 'none' }}
                  >
                    Continue <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 2 — Contact Details */}
        {step === 2 && (
          <div className="card shadow-sm border-0 fade-in-up">
            <div className="card-header p-4 border-0" style={{ background: 'linear-gradient(135deg, #20c997 0%, #198754 100%)' }}>
               <div className="d-flex align-items-center gap-2 mb-1 text-white">
                 <i className="bi bi-globe fs-5"></i>
                 <h4 className="fw-bold mb-0">Contact Details</h4>
               </div>
               <p className="mb-0 text-white opacity-75 small">How can volunteers reach you?</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateSubmit(); }}>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label fw-semibold">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="123 Main Street, City, State"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="contact@organization.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-semibold">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="website" className="form-label fw-semibold">Website (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="website"
                    placeholder="https://yourorganization.org"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="d-flex gap-3">
                  <button type="button" className="btn btn-outline-secondary flex-grow-1" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}
                          style={{ background: 'linear-gradient(135deg, #20c997 0%, #198754 100%)', border: 'none' }}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create NGO
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOOnboarding;
