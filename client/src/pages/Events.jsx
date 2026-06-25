import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import LoadingFallback from "@/components/LoadingFallback";
import EventDetailsModal from "@/components/EventDetailsModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { getErrorMessage } from "../api";
import { useToast } from "../context/ToastContext";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await API.get("/event");
      // Assuming response.data.data is the array of events based on previous files
      setEvents(response.data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login as a volunteer to join events", "warning");
      navigate("/login");
      return;
    }

    try {
      const response = await API.put(`/event/join/${eventId}`);
      if (response.data.success) {
        showToast("Successfully joined the event!", "success");
        // Refresh events to update volunteer count
        fetchEvents();
        // If modal is open and shows this event, update it
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent(response.data.data);
        }
      }
    } catch (err) {
      console.error("Error joining event:", err);
      showToast(getErrorMessage(err), "danger");
    }
  };

  const filteredEvents = events.filter((event) => {
    const titleMatch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const ngoMatch = event.ngo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false; // Adjusted for populated ngo object
    const locationMatch = event.location?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    // Fallback for ngo if it's just an ID or string
    const ngoStringMatch = typeof event.ngo === 'string' && event.ngo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = titleMatch || ngoMatch || locationMatch || ngoStringMatch;
    
    // Status filter logic
    // If event object doesn't have an explicit status field, we can derive it
    // For now assuming 'status' field exists or defaulting to 'open'
    const eventStatus = event.status || 'open'; 
    const matchesStatus = statusFilter === "all" || eventStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <LoadingFallback />
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Header */}
      <div className="hero-section text-white p-5 mb-0 rounded-0">
        <div className="container">
          <div className="d-flex align-items-center gap-3 mb-2">
            <i className="bi bi-calendar-event fs-2"></i>
            <h1 className="display-5 fw-bold mb-0">Upcoming Events</h1>
          </div>
          <p className="lead opacity-75 mb-0">
            Discover volunteer opportunities and make an impact in your community
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-bottom shadow-sm sticky-top" style={{ top: '70px', zIndex: 99 }}>
        <div className="container py-3">
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search events, NGOs, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-funnel text-muted"></i>
                </span>
                <select 
                  className="form-select border-start-0" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Events</option>
                  <option value="open">Open</option>
                  <option value="full">Full</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <main className="flex-grow-1 py-5">
        <div className="container">
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {!error && filteredEvents.length > 0 ? (
            <div className="row g-4">
              {filteredEvents.map((event) => (
                <div key={event._id || event.id} className="col-md-6 col-lg-4">
                  <EventCard
                    eventId={event._id}
                    title={event.title}
                    description={event.description}
                    date={new Date(event.date).toLocaleDateString()}
                    location={event.location}
                    ngo={event.ngo}
                    volunteers={event.volunteers?.length || 0}
                    maxVolunteers={event.maxVolunteers}
                    status={event.status || 'open'}
                    onJoin={() => handleJoinEvent(event._id)}
                    onView={() => {
                      setSelectedEvent(event);
                      setShowModal(true);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            !error && (
              <div className="text-center py-5">
                <div className="mb-4 d-inline-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-calendar-x text-muted fs-1"></i>
                </div>
                <h3 className="fw-semibold">No events found</h3>
                <p className="text-muted">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  className="btn btn-outline-secondary mt-3"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )
          )}
        </div>
      </main>

      <EventDetailsModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        event={selectedEvent} 
        onJoin={handleJoinEvent}
      />

      <Footer />
    </div>
  );
};

export default Events;
