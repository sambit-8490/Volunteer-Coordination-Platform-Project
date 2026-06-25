import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import API, { getErrorMessage } from "../api";
import { useToast } from "../context/ToastContext";

const EventEditModal = ({ show, onHide, eventData, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxVolunteers: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (eventData) {
      // Format the date to YYYY-MM-DD for the input[type="date"]
      const formattedDate = eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : "";
      
      setFormData({
        title: eventData.title || "",
        description: eventData.description || "",
        date: formattedDate,
        location: eventData.location || "",
        maxVolunteers: eventData.maxVolunteers || 50,
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.put(`/event/${eventData._id}`, formData);
      if (response.data.success) {
        showToast("Event updated successfully! 🎉", "success");
        onSave(response.data.data);
        onHide();
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="border-bottom-0 bg-light">
        <Modal.Title className="fw-bold text-success">Edit Event Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i> {error}
          </div>
        )}
        
        <Form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <Form.Group>
                <Form.Label className="fw-semibold">Event Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label className="fw-semibold">Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <Form.Group>
                <Form.Label className="fw-semibold">Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label className="fw-semibold">Max Volunteers</Form.Label>
                <Form.Control
                  type="number"
                  name="maxVolunteers"
                  min="1"
                  value={formData.maxVolunteers}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              placeholder="Provide a detailed description of the event..."
              value={formData.description}
              onChange={handleChange}
              required
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
                "Update Event"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventEditModal;
