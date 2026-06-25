import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import API from "../api";

const NGOProfileEditModal = ({ show, onHide, ngoData, onSave }) => {
  const [formData, setFormData] = useState({
    description: "",
    mission: "",
    website: "",
    address: "",
    phone: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ngoData) {
      setFormData({
        description: ngoData.description || "",
        mission: ngoData.mission || "",
        website: ngoData.website || "",
        address: ngoData.address || "",
        phone: ngoData.phone || "",
        category: ngoData.category || "",
      });
    }
  }, [ngoData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.put(`/ngo/${ngoData._id}`, formData);
      onSave(response.data.data);
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="border-bottom-0 bg-light">
        <Modal.Title className="fw-bold text-success">Edit Organization Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i> {error}
          </div>
        )}
        
        <Form onSubmit={handleSubmit}>
          {/* Read-only Name Field */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-muted">Organization Name</Form.Label>
            <Form.Control 
              type="text" 
              value={ngoData?.name || ""} 
              disabled 
              className="bg-light"
              title="Name cannot be changed" 
            />
            <Form.Text className="text-muted small">
              <i className="bi bi-info-circle me-1"></i> Organization name cannot be changed
            </Form.Text>
          </Form.Group>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="fw-semibold">Website</Form.Label>
                <Form.Control
                  type="text"
                  name="website"
                  placeholder="https://example.org"
                  value={formData.website}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>

          <div className="row g-3 mb-3">
             <div className="col-md-6">
               <Form.Group>
                 <Form.Label className="fw-semibold">Phone</Form.Label>
                 <Form.Control
                   type="text"
                   name="phone"
                   placeholder="+1 234 567 890"
                   value={formData.phone}
                   onChange={handleChange}
                 />
               </Form.Group>
             </div>
             <div className="col-md-6">
               <Form.Group>
                 <Form.Label className="fw-semibold">Address</Form.Label>
                 <Form.Control
                   type="text"
                   name="address"
                   placeholder="Main St, City"
                   value={formData.address}
                   onChange={handleChange}
                 />
               </Form.Group>
             </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Mission Statement</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="mission"
              placeholder="Our mission is to..."
              value={formData.mission}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              placeholder="Detailed description of your organization..."
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={loading} className="px-4">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NGOProfileEditModal;
