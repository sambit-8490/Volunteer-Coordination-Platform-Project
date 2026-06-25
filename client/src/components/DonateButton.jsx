import { useState } from "react";
import { createPortal } from "react-dom";
import API from "../api";
import { useToast } from "../context/ToastContext";

const DonateButton = ({ ngoId, ngoName, eventTitle, eventId, variant = "outline", size = "sm", className = "" }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("25");
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const presetAmounts = ["10", "25", "50", "100"];

  const handleDonate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await API.post("/donate", {
        ngoId,
        amount,
        eventId
      });

      showToast(`Thank you! 💚\nYour ₹${amount} donation to ${ngoName} was successful!`, "success", "Donation Successful");
      setOpen(false);
    } catch (error) {
      console.error("Donation failed", error);
      showToast(error.response?.data?.message || "Donation failed. Please try again.", "danger", "Donation Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const btnClass = variant === "outline" ? "btn-outline-success" : "btn-success";
  const btnSize = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <>
      <button 
        className={`btn ${btnClass} ${btnSize} d-flex align-items-center gap-1 ${className}`} 
        onClick={() => setOpen(true)}
      >
        <i className="bi bi-heart"></i> Donate
      </button>

      {open && createPortal(
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', zIndex: 1060 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <i className="bi bi-heart-fill text-success"></i> Support {ngoName}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-4">
                  {eventTitle
                    ? `Your donation supports the "${eventTitle}" event`
                    : `Help ${ngoName} continue their mission`}
                </p>

                <form onSubmit={handleDonate}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Amount (INR)</label>
                    <div className="d-flex gap-2 justify-content-between">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`btn btn-sm ${amount === preset ? "btn-success" : "btn-outline-success"} flex-grow-1`}
                          onClick={() => setAmount(preset)}
                        >
                          ₹{preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="customAmount" className="form-label small fw-bold">Or enter custom amount</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        id="customAmount"
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                  </div>



                  <button 
                    type="submit" 
                    className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2" 
                    disabled={isProcessing || !amount}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card"></i> Donate ₹{amount}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DonateButton;
