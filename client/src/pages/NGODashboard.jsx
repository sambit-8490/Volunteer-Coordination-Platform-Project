import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/DashboardHeader";
import ProfileCard from "@/components/ProfileCard";
import StatsCard from "@/components/StatsCard";
import NGOProfileEditModal from "@/components/NGOProfileEditModal";
import EventEditModal from "@/components/EventEditModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { getErrorMessage } from "../api";
import { useToast } from "../context/ToastContext";

const NGODashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [ngo, setNgo] = useState(null);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxVolunteers: 50,
  });
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showApprovedBanner, setShowApprovedBanner] = useState(true);

  useEffect(() => {
    fetchNGOData();
  }, []);

  // Auto-hide approved banner after 5 seconds
  useEffect(() => {
    if (ngo && ngo.status === 'approved' && showApprovedBanner) {
      const timer = setTimeout(() => {
        setShowApprovedBanner(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [ngo, showApprovedBanner]);

  const fetchNGOData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch NGO profile and events
      const [eventsRes, ngoRes] = await Promise.all([
        API.get("/event/my"),
        API.get("/ngo/my")
      ]);

      setEvents(eventsRes.data.data || []);
      setNgo(ngoRes.data.data);

      // Fetch donations if NGO is approved
      if (ngoRes.data.data.status === 'approved') {
        try {
          const ngoId = ngoRes.data.data._id;
          const donationsRes = await API.get(`/donate/ngo/${ngoId}`);
          setDonations(donationsRes.data.data || []);
        } catch (reqErr) {
          console.error("Failed to fetch donations", reqErr);
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // No NGO found, redirect to onboarding
        navigate("/ngo-onboarding");
      } else {
        setError(err.response?.data?.message || "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreatingEvent(true);
    setError("");

    try {
      const response = await API.post("/event", eventForm);

      // Add new event to the list
      setEvents([response.data.data, ...events]);

      // Reset form
      setEventForm({
        title: "",
        description: "",
        date: "",
        location: "",
        maxVolunteers: 50,
      });

      showToast("Event Created Successfully! 🎉", "success");
    } catch (err) {
      setError(getErrorMessage(err));
      showToast(getErrorMessage(err), "danger");
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/event/${eventId}`);
      setEvents(events.filter((e) => e._id !== eventId));
      showToast("Event deleted successfully!", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "danger");
    }
  };



  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <DashboardHeader
        title="NGO Dashboard"
        subtitle="Manage your profile and events here."
        userName={ngo?.name}
      />

      <main className="flex-grow-1 py-5">
        <div className="container">
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i> {error}
            </div>
          )}

          {/* NGO Approval Status Banner */}
          {ngo && ngo.status !== 'approved' && (
            <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
              <div className="flex-grow-1">
                <h6 className="alert-heading fw-bold mb-1">NGO Pending Approval</h6>
                <p className="mb-0 small">
                  Your NGO registration is currently under review by our admin team. 
                  You can view your dashboard but cannot create events until your NGO is approved.
                </p>
              </div>
            </div>
          )}

          {ngo && ngo.status === 'approved' && showApprovedBanner && (
            <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-check-circle-fill fs-4 me-3"></i>
              <div className="flex-grow-1">
                <h6 className="alert-heading fw-bold mb-1">NGO Approved ✓</h6>
                <p className="mb-0 small">
                  Your NGO has been approved! You can now create and manage events.
                </p>
              </div>
            </div>
          )}

          <div className="row g-5">
            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4">
                <ProfileCard
                  name={ngo?.name}
                  email={ngo?.email}
                  role="ngo"
                  totalEvents={events.length}
                />

                {/* Organization Profile Card */}
                <div className="card border-1 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-bold mb-0">Organization Profile</h5>
                      <button 
                        className="btn btn-sm btn-outline-success"
                        onClick={() => setShowEditModal(true)}
                      >
                        Edit
                      </button>
                    </div>

                    {ngo && (
                      <div className="d-flex flex-column gap-3 small">
                         <div>
                           <p className="text-muted mb-1 fw-medium">Mission</p>
                           <p className="mb-0 text-dark fst-italic">
                             {ngo.mission || "No mission statement provided yet."}
                           </p>
                         </div>
                         
                         {ngo.website && (
                           <div className="d-flex align-items-center gap-2">
                             <i className="bi bi-globe text-success"></i>
                             <a href={ngo.website.startsWith('http') ? ngo.website : `https://${ngo.website}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark hover-success">
                               {ngo.website}
                             </a>
                           </div>
                         )}

                         {ngo.phone && (
                           <div className="d-flex align-items-center gap-2">
                             <i className="bi bi-telephone text-success"></i>
                             <span>{ngo.phone}</span>
                           </div>
                         )}

                          {ngo.address && (
                           <div className="d-flex align-items-center gap-2">
                             <i className="bi bi-geo-alt text-success"></i>
                             <span>{ngo.address}</span>
                           </div>
                         )}
                         
                         {ngo.category && (
                           <div className="d-flex align-items-center gap-2">
                             <i className="bi bi-tag text-success"></i>
                             <span className="text-capitalize">{ngo.category}</span>
                           </div>
                         )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats with Vibrant Styling */}
                <div className="d-flex flex-column gap-3">
                  <div className="card border-1 card-hover shadow-sm overflow-hidden">
                    <div className="card-body p-4 position-relative">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-1 opacity-75 fw-medium">Total Events</p>
                          <h2 className="mb-0 fw-bold">{events.length}</h2>
                        </div>
                        <div className="bg-success bg-opacity-25 rounded-circle icon-scale">
                          <i className="bi bi-calendar-event fs-3"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card border-1 card-hover shadow-sm overflow-hidden">
                    <div className="card-body p-4 position-relative">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-1 opacity-75 fw-medium">
                            Total Volunteers
                          </p>
                          <h2 className="mb-0 fw-bold">
                            {events.reduce(
                              (sum, event) =>
                                sum + (event.volunteers?.length || 0),
                              0
                            )}
                          </h2>
                        </div>
                        <div className="bg-success bg-opacity-25 rounded-circle icon-scale">
                          <i className="bi bi-people fs-3"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Donations Stat */}
                   <div className="card border-1 card-hover shadow-sm overflow-hidden">
                    <div className="card-body p-4 position-relative">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-1 opacity-75 fw-medium">
                            Total Donations
                          </p>
                          <h2 className="mb-0 fw-bold text-success">
                            ₹{donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-IN')}
                          </h2>
                        </div>
                        <div className="bg-warning bg-opacity-25 rounded-circle icon-scale">
                          <i className="bi bi-cash-coin fs-3"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-5">
                {/* Create Event Form with Vibrant Styling */}
                <div className="card shadow-sm border-0 overflow-hidden position-relative">
                  {/* Disabled Overlay for Unapproved NGOs */}
                  {ngo && ngo.status !== 'approved' && (
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        zIndex: 10,
                        backdropFilter: 'blur(2px)'
                      }}
                    >
                      <div className="text-center p-4">
                        <i className="bi bi-lock-fill fs-1 text-warning mb-3 d-block"></i>
                        <h5 className="fw-bold mb-2">Event Creation Locked</h5>
                        <p className="text-muted mb-0">
                          Your NGO must be approved by admin before you can create events.
                        </p>
                      </div>
                    </div>
                  )}
                  <div
                    className="card-header p-4 border-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #20c997 0%, #198754 100%)",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 text-white">
                      <div
                        className="bg-white bg-opacity-25 p-3 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i className="bi bi-plus-lg fs-4"></i>
                      </div>
                      <h4 className="fw-bold mb-0">Create Event</h4>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <form onSubmit={handleCreateEvent}>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label
                            htmlFor="title"
                            className="form-label fw-semibold"
                          >
                            Event Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Enter event title"
                            value={eventForm.title}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                title: e.target.value,
                              })
                            }
                            required
                            disabled={ngo?.status !== 'approved'}
                          />
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="date"
                            className="form-label fw-semibold"
                          >
                            Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="date"
                            value={eventForm.date}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                date: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="location"
                          className="form-label fw-semibold"
                        >
                          Location
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-geo-alt text-muted"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            id="location"
                            placeholder="Enter event location"
                            value={eventForm.location}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                location: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="maxVolunteers"
                          className="form-label fw-semibold"
                        >
                          Max Volunteers
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="maxVolunteers"
                          min="1"
                          value={eventForm.maxVolunteers}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              maxVolunteers: parseInt(e.target.value),
                            })
                          }
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="form-label fw-semibold"
                        >
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          rows="3"
                          placeholder="Describe your event..."
                          value={eventForm.description}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              description: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                        disabled={creatingEvent || ngo?.status !== 'approved'}
                        style={{
                          background:
                            "linear-gradient(135deg, #20c997 0%, #198754 100%)",
                          border: "none",
                        }}
                      >
                        {creatingEvent ? (
                          <>
                            <span className="spinner-border spinner-border-sm"></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-lg"></i>
                            Create Event
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Your Events */}
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    <h4 className="card-title fw-bold mb-4">Your Events</h4>

                    {events.length > 0 ? (
                      <div className="d-flex flex-column gap-3">
                        {events.map((event) => (
                          <div
                            key={event._id}
                            className="border rounded p-3 position-relative overflow-hidden"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(250, 250, 250, 1) 0%, rgba(240, 240, 255, 1) 100%)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-2px)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          >
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                              <div className="flex-grow-1">
                                <h6 className="fw-bold mb-1">{event.title}</h6>
                                <p className="text-muted small mb-2">
                                  {event.description}
                                </p>
                                <div className="d-flex flex-wrap gap-3 text-muted small">
                                  <span className="d-flex align-items-center gap-1">
                                    <i className="bi bi-calendar"></i>
                                    {new Date(event.date).toLocaleDateString()}
                                  </span>
                                  <span className="d-flex align-items-center gap-1">
                                    <i className="bi bi-geo-alt"></i>
                                    {event.location}
                                  </span>
                                  <span className="d-flex align-items-center gap-1">
                                    <i className="bi bi-people"></i>
                                    {event.volunteers?.length || 0} /{" "}
                                    {event.maxVolunteers} volunteers
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                                  onClick={() => {
                                    setEditingEvent(event);
                                    setShowEditEventModal(true);
                                  }}
                                >
                                  <i className="bi bi-pencil"></i>
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                  onClick={() => handleDeleteEvent(event._id)}
                                >
                                  <i className="bi bi-trash"></i>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5 text-muted">
                        <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
                        No events created yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Donation History Section */}
                {ngo?.status === 'approved' && (
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-white border-bottom p-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="fw-bold mb-0">Donation History</h4>
                        <span className="badge bg-success bg-opacity-10 text-success">
                          {donations.length} Donations
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      {donations.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th className="border-0 px-4 py-3">Donor</th>
                                <th className="border-0 px-4 py-3">Date</th>
                                <th className="border-0 px-4 py-3">Event</th>
                                <th className="border-0 px-4 py-3 text-end">Amount</th>
                                <th className="border-0 px-4 py-3 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {donations.map((donation) => (
                                <tr key={donation._id}>
                                  <td className="px-4 py-3 align-middle">
                                    <div className="fw-semibold">{donation.donor?.name || 'Anonymous'}</div>
                                    <div className="small text-muted">{donation.donor?.email}</div>
                                  </td>
                                  <td className="px-4 py-3 align-middle">
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 align-middle text-muted">
                                    {donation.event?.title ? (
                                      <span className="d-flex align-items-center gap-1">
                                        <i className="bi bi-calendar-event text-success"></i>
                                        {donation.event.title}
                                      </span>
                                    ) : (
                                      <span className="fst-italic opacity-75">Direct Donation</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 align-middle text-end fw-bold text-success">
                                    ₹{donation.amount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="px-4 py-3 align-middle text-center">
                                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill">
                                      {donation.paymentStatus}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-5 text-muted">
                          <div className="bg-light rounded-circle p-3 d-inline-block mb-3">
                            <i className="bi bi-cash-stack fs-1 text-secondary"></i>
                          </div>
                          <h5>No donations yet</h5>
                          <p className="mb-0">Share your cause to start receiving support!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <NGOProfileEditModal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        ngoData={ngo}
        onSave={(updatedNgo) => setNgo(updatedNgo)}
      />

      <EventEditModal
        show={showEditEventModal}
        onHide={() => setShowEditEventModal(false)}
        eventData={editingEvent}
        onSave={(updatedEvent) => {
          setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
        }}
      />

      <Footer />
    </div>
  );
};

export default NGODashboard;
