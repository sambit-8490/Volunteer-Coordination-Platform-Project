import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useToast } from "../context/ToastContext";

const VolunteerOnboarding = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    profession: "",
    experience: "",
    skills: "",
    education: "",
    location: "",
    availability: "",
    interests: [],
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/volunteer/profile");
      if (response.data.success && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (err) {
      // Ignore 404/error, just means no profile yet
      console.log("No existing profile found");
    }
  };

  const interestOptions = [
    { id: "environment", label: "Environment & Nature", icon: "🌱" },
    { id: "education", label: "Education & Mentoring", icon: "📚" },
    { id: "healthcare", label: "Healthcare & Wellness", icon: "🏥" },
    { id: "food", label: "Food Security & Hunger", icon: "🍲" },
    { id: "elderly", label: "Senior Care", icon: "👴" },
    { id: "animals", label: "Animal Welfare", icon: "🐾" },
    { id: "disaster", label: "Disaster Relief", icon: "🆘" },
    { id: "community", label: "Community Development", icon: "🏘️" },
    { id: "arts", label: "Arts & Culture", icon: "🎨" },
    { id: "sports", label: "Sports & Recreation", icon: "⚽" },
  ];

  const toggleInterest = (id) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Save volunteer profile to backend
      const response = await API.post("/volunteer/profile", {
        profession: formData.profession,
        experience: formData.experience,
        skills: formData.skills,
        education: formData.education,
        location: formData.location,
        availability: formData.availability,
        interests: formData.interests,
        bio: formData.bio
      });

      if (response.data.success) {
        // Update user in localStorage to reflect onboarding completion
        const user = JSON.parse(localStorage.getItem("user"));
        user.onboardingCompleted = true;
        localStorage.setItem("user", JSON.stringify(user));
        
        showToast("Profile Completed! 🎉\nWe'll now recommend events based on your interests and skills.", "success");
        navigate("/volunteer-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5 d-flex align-items-center">
      <div className="container" style={{ maxWidth: '700px' }}>
        {/* Progress Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted">
            Help us match you with the perfect volunteer opportunities
          </p>
          <div className="mt-4 d-flex align-items-center justify-content-center gap-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${
                  s === step
                    ? "bg-success text-white shadow"
                    : s < step
                    ? "bg-success text-white"
                    : "bg-white border text-muted"
                }`}
                style={{ width: '40px', height: '40px' }}
              >
                {s < step ? <i className="bi bi-check-lg"></i> : s}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Professional Info */}
        {step === 1 && (
          <div className="card shadow-sm border-0 fade-in-up">
            <div className="card-header bg-white p-4 border-bottom-0">
               <div className="d-flex align-items-center gap-2 mb-1">
                 <i className="bi bi-briefcase text-success fs-5"></i>
                 <h4 className="card-title fw-bold mb-0">Professional Background</h4>
               </div>
               <p className="card-subtitle text-muted">Tell us about your work experience and skills</p>
            </div>
            <div className="card-body p-4 pt-0">
              <div className="mb-3">
                <label htmlFor="profession" className="form-label fw-semibold">Current Profession</label>
                <select
                  className="form-select"
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                >
                  <option value="">Select your profession</option>
                  <option value="student">Student</option>
                  <option value="engineer">Engineer / IT</option>
                  <option value="healthcare">Healthcare Professional</option>
                  <option value="teacher">Teacher / Educator</option>
                  <option value="business">Business / Finance</option>
                  <option value="creative">Creative / Designer</option>
                  <option value="legal">Legal Professional</option>
                  <option value="retired">Retired</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="experience" className="form-label fw-semibold">Years of Experience</label>
                <select
                  className="form-select"
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                   <option value="">Select experience level</option>
                   <option value="0-1">Less than 1 year</option>
                   <option value="1-3">1-3 years</option>
                   <option value="3-5">3-5 years</option>
                   <option value="5-10">5-10 years</option>
                   <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="skills" className="form-label fw-semibold">Key Skills</label>
                <input
                  type="text"
                  className="form-control"
                  id="skills"
                  placeholder="e.g., Teaching, First Aid, Project Management"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="education" className="form-label fw-semibold">Highest Education</label>
                <select
                  className="form-select"
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD / Doctorate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button className="btn btn-success w-100" onClick={() => setStep(2)}>
                Continue <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div className="card shadow-sm border-0 fade-in-up">
            <div className="card-header bg-white p-4 border-bottom-0">
               <div className="d-flex align-items-center gap-2 mb-1">
                 <i className="bi bi-heart text-success fs-5"></i>
                 <h4 className="card-title fw-bold mb-0">Your Interests</h4>
               </div>
               <p className="card-subtitle text-muted">Select causes you're passionate about (choose at least 2)</p>
            </div>
            <div className="card-body p-4 pt-0">
              <div className="row g-3 mb-4">
                {interestOptions.map((interest) => (
                  <div key={interest.id} className="col-md-6">
                    <input
                      type="checkbox"
                      className="btn-check"
                      id={interest.id}
                      checked={formData.interests.includes(interest.id)}
                      onChange={() => toggleInterest(interest.id)}
                    />
                    <label
                      className={`btn btn-outline-light w-100 d-flex align-items-center gap-3 p-3 text-start border ${formData.interests.includes(interest.id) ? 'active-interest border-success bg-success bg-opacity-10 text-dark' : 'text-dark'}`}
                      htmlFor={interest.id}
                    >
                      <span className="fs-5">{interest.icon}</span>
                      <span className="fw-medium">{interest.label}</span>
                      {formData.interests.includes(interest.id) && <i className="bi bi-check-circle-fill text-success ms-auto"></i>}
                    </label>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-3">
                <button className="btn btn-outline-secondary flex-grow-1" onClick={() => setStep(1)}>
                  back
                  </button>
                <button
                  className="btn btn-success flex-grow-1"
                  onClick={() => setStep(3)}
                  disabled={formData.interests.length < 2}
                >
                  Continue <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Availability */}
        {step === 3 && (
          <div className="card shadow-sm border-0 fade-in-up">
            <div className="card-header bg-white p-4 border-bottom-0">
               <div className="d-flex align-items-center gap-2 mb-1">
                 <i className="bi bi-geo-alt text-success fs-5"></i>
                 <h4 className="card-title fw-bold mb-0">Availability & Location</h4>
               </div>
               <p className="card-subtitle text-muted">Tell us where and when you can volunteer</p>
            </div>
            <div className="card-body p-4 pt-0">
              <div className="mb-3">
                <label htmlFor="location" className="form-label fw-semibold">Your City / Region</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  placeholder="e.g., madhapur, Hyderabad, Telangana"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="availability" className="form-label fw-semibold">Availability</label>
                <select
                  className="form-select"
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                >
                  <option value="">When can you volunteer?</option>
                  <option value="weekdays">Weekdays only</option>
                  <option value="weekends">Weekends only</option>
                  <option value="evenings">Evenings</option>
                  <option value="flexible">Flexible / Anytime</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="bio" className="form-label fw-semibold">Short Bio (Optional)</label>
                <textarea
                  className="form-control"
                  id="bio"
                  rows="4"
                  placeholder="Tell NGOs a bit about yourself and why you want to volunteer..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                ></textarea>
              </div>

              <div className="d-flex gap-3">
                <button className="btn btn-outline-secondary flex-grow-1" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-success flex-grow-1" onClick={handleSubmit}>
                   <i className="bi bi-check-circle me-2"></i>
                   Complete Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerOnboarding;
