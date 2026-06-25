import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const Donate = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedNgo, setSelectedNgo] = useState("");
  const [ngos, setNgos] = useState([]);
  const [loadingNgos, setLoadingNgos] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = ["10", "25", "50", "100", "250"];

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      const response = await API.get("/ngo");
      setNgos(response.data.data);
    } catch (error) {
      console.error("Failed to fetch NGOs", error);
    } finally {
      setLoadingNgos(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      showToast("Please login to donate.", "warning");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    const finalAmount = customAmount || amount;

    try {
      await API.post("/donate", {
        ngoId: selectedNgo,
        amount: finalAmount
      });

      showToast(`Donation Successful! 🎉\nThank you for your generous donation of ₹${finalAmount}!`, "success", "Donation Successful");
      
      // Reset form
      setAmount("");
      setCustomAmount("");
      setSelectedNgo("");

    } catch (error) {
      console.error("Donation failed", error);
      showToast(error.response?.data?.message || "Donation failed. Please try again.", "danger", "Donation Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const finalAmount = customAmount || amount;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Header */}
      <div className="hero-section text-white p-5 mb-0 text-center rounded-0">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center bg-gradient-brand shadow-sm rounded-circle mb-4 mx-auto" style={{ width: '80px', height: '80px' }}>
             <i className="bi bi-heart-fill fs-1"></i>
          </div>
          <h1 className="fw-bold display-5">Make a Donation</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
            Your contribution helps NGOs create lasting change in communities around the world
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="row g-5">
            {/* Donation Form */}
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-bottom p-4">
                  <h4 className="card-title fw-bold mb-1">Donation Details</h4>
                  <p className="card-subtitle text-muted small">Choose an NGO and amount to support their mission</p>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    {/* Select NGO */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">Select an NGO to Support</label>
                      <select 
                        className="form-select" 
                        value={selectedNgo} 
                        onChange={(e) => setSelectedNgo(e.target.value)}
                        required
                        disabled={loadingNgos}
                      >
                        <option value="">{loadingNgos ? "Loading NGOs..." : "Choose an NGO..."}</option>
                        {ngos.map((ngo) => (
                          <option key={ngo._id} value={ngo._id}>
                            {ngo.name} {ngo.category ? `• ${ngo.category}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount Selection */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">Select Amount (INR)</label>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {presetAmounts.map((preset) => (
                           <button
                             key={preset}
                             type="button"
                             className={`btn flex-grow-1 ${amount === preset ? 'btn-success' : 'btn-outline-success'}`}
                             onClick={() => {
                               setAmount(preset);
                               setCustomAmount("");
                             }}
                           >
                             ₹{preset}
                           </button>
                        ))}
                      </div>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter custom amount"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setAmount("");
                          }}
                          min="1"
                        />
                      </div>
                    </div>



                    <button
                      type="submit"
                      className="btn btn-success w-100 btn-lg fw-bold d-flex align-items-center justify-content-center gap-2"
                      disabled={isProcessing || (!amount && !customAmount) || !selectedNgo}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-heart-fill"></i>
                          Donate {finalAmount ? `₹${finalAmount}` : ""}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4">
                {/* Impact Card */}
                <div className="card shadow-sm border-0 overflow-hidden">
                  <div className="card-header bg-gradient bg-success text-white p-3 border-0">
                    <h5 className="mb-0 text-center"><i className="bi bi-stars me-2"></i> Your Impact</h5>
                  </div>
                  <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex gap-3 py-3">
                        <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1"></i>
                        <div>
                          <span className="fw-bold d-block">₹10</span>
                          <span className="text-muted small">Provides meals for 5 people</span>
                        </div>
                      </li>
                      <li className="list-group-item d-flex gap-3 py-3">
                        <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1"></i>
                        <div>
                          <span className="fw-bold d-block">₹25</span>
                          <span className="text-muted small">Plants 10 trees</span>
                        </div>
                      </li>
                      <li className="list-group-item d-flex gap-3 py-3">
                        <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1"></i>
                        <div>
                          <span className="fw-bold d-block">₹50</span>
                          <span className="text-muted small">Supplies school kits for 5 children</span>
                        </div>
                      </li>
                      <li className="list-group-item d-flex gap-3 py-3">
                         <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1"></i>
                         <div>
                           <span className="fw-bold d-block">₹100</span>
                           <span className="text-muted small">Funds a community workshop</span>
                         </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="card shadow-sm border-0">
                   <div className="card-body">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="icon-box bg-success bg-opacity-10 text-success p-2 rounded">
                           <i className="bi bi-shield-lock fs-4"></i>
                        </div>
                        <div>
                           <div className="fw-bold">Secure Payments</div>
                           <small className="text-muted">256-bit SSL encryption</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="icon-box bg-primary bg-opacity-10 text-primary p-2 rounded">
                           <i className="bi bi-people fs-4"></i>
                        </div>
                        <div>
                           <div className="fw-bold">10,000+ Donors</div>
                           <small className="text-muted">Join our community</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div className="icon-box bg-warning bg-opacity-10 text-warning p-2 rounded">
                           <i className="bi bi-heart fs-4"></i>
                        </div>
                        <div>
                           <div className="fw-bold">100% Goes to Cause</div>
                           <small className="text-muted">No platform fees</small>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
