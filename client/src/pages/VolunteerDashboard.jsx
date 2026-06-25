import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/DashboardHeader";
import ProfileCard from "@/components/ProfileCard";
import EventCard from "@/components/EventCard";
import EventDetailsModal from "@/components/EventDetailsModal";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API, { getErrorMessage } from "../api";
import { useToast } from "../context/ToastContext";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("available");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      
      if (!userData) {
        navigate("/login");
        return;
      }

      setUser(userData);

      // Fetch all events
      const eventsRes = await API.get("/event");
      const events = eventsRes.data.data || [];
      
      setAllEvents(events);

      // Filter events where user is registered
      const registeredEvents = events.filter(event => 
        event.volunteers?.some(volunteer => volunteer._id === userData.id || volunteer === userData.id)
      );
      setMyEvents(registeredEvents);

      // Fetch volunteer profile if onboarding is completed
      if (userData.onboardingCompleted) {
        try {
          const profileRes = await API.get("/volunteer/profile");
          if (profileRes.data.success) {
            setVolunteerProfile(profileRes.data.data);
          }
        } catch (profileErr) {
          console.log("Profile not found:", profileErr);
        }
      }

    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };


  const handleJoinEvent = async (eventId) => {
    try {
      await API.post(`/event/${eventId}/register`);
      showToast("Successfully registered for event! 🎉", "success");
      // Refresh data
      fetchDashboardData();
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
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter available events (not yet joined)
  const availableEvents = allEvents.filter(event => 
    !myEvents.some(myEvent => myEvent._id === event._id)
  );

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <DashboardHeader
        title="Volunteer Dashboard"
        subtitle="View your profile and join events here."
        userName={user?.name}
      />

      <main className="flex-grow-1 py-5">
        <div className="container">
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i> {error}
            </div>
          )}

          <div className="row g-5">
            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4">
                <ProfileCard
                  name={user?.name}
                  email={user?.email}
                  role="volunteer"
                  joinedEvents={myEvents.length}
                />

                {/* Volunteer Profile Details Card */}
                <div className="card border-1 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-bold mb-0">Your Profile</h5>
                      <Link to="/volunteer-onboarding" className="btn btn-sm btn-outline-success">
                        Edit
                      </Link>
                    </div>

                    {(() => {
                      const profile = volunteerProfile || {};
                      const interestLabels = {
                        environment: "Environment",
                        education: "Education",
                        healthcare: "Healthcare",
                        food: "Food Security",
                        elderly: "Elder Care",
                        animals: "Animal Welfare",
                        disaster: "Disaster Relief",
                        community: "Community",
                        arts: "Arts & Culture",
                        sports: "Sports"
                      };

                      return (
                        <>
                          <div className="d-flex flex-column gap-2 mb-3">
                            {profile.profession && (
                              <div className="d-flex align-items-center gap-2 text-muted small">
                                <i className="bi bi-briefcase text-success"></i>
                                <span>Profession:</span>
                                <span className="text-dark fw-medium">{profile.profession}</span>
                              </div>
                            )}
                            {profile.location && (
                              <div className="d-flex align-items-center gap-2 text-muted small">
                                <i className="bi bi-geo-alt text-success"></i>
                                <span>Location:</span>
                                <span className="text-dark fw-medium">{profile.location}</span>
                              </div>
                            )}
                            {profile.availability && (
                              <div className="d-flex align-items-center gap-2 text-muted small">
                                <i className="bi bi-clock text-success"></i>
                                <span>Availability:</span>
                                <span className="text-dark fw-medium">{profile.availability}</span>
                              </div>
                            )}
                          </div>

                          {profile.interests && profile.interests.length > 0 && (
                            <div className="border-top pt-3 mb-3">
                              <p className="small text-muted mb-2 fw-medium">Interests</p>
                              <div className="d-flex flex-wrap gap-2">
                                {profile.interests.map((interest) => (
                                  <span key={interest} className="badge bg-success bg-opacity-10 text-success fw-normal border border-success">
                                    {interestLabels[interest] || interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {profile.skills && (
                            <div className="border-top pt-3">
                              <p className="small text-muted mb-2 fw-medium">Skills</p>
                              <div className="d-flex flex-wrap gap-2">
                                {profile.skills.split(',').map((skill, index) => (
                                  <span key={index} className="badge border fw-normal text-muted">
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {!profile.profession && !profile.location && (
                            <div className="text-center py-3">
                              <p className="text-muted small mb-2">Complete your profile to get started</p>
                              <Link to="/volunteer-onboarding" className="btn btn-sm btn-success">
                                Complete Profile
                              </Link>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Quick Stats with Platform Branding */}
                <div className="d-flex flex-column gap-3">
                  <div className="card border-1 card-hover shadow-sm overflow-hidden">
                    <div className="card-body p-4 position-relative">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-1 opacity-75 fw-medium">Events Joined</p>
                          <h2 className="mb-0 fw-bold">{myEvents.length}</h2>
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
                          <p className="mb-1 opacity-75 fw-medium">Available Events</p>
                          <h2 className="mb-0 fw-bold">{availableEvents.length}</h2>
                        </div>
                        <div className="bg-primary bg-opacity-25 rounded-circle icon-scale">
                          <i className="bi bi-calendar-plus fs-3"></i>
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
                {/* Tabs & Event Lists */}
                <div>
                   <ul className="nav nav-tabs mb-4">
                     <li className="nav-item">
                       <button
                         className={`nav-link ${activeTab === "available" ? "active fw-bold" : "text-muted"}`}
                         onClick={() => setActiveTab("available")}
                       >
                         Available Events
                       </button>
                     </li>
                     <li className="nav-item">
                       <button
                         className={`nav-link ${activeTab === "my-events" ? "active fw-bold" : "text-muted"}`}
                         onClick={() => setActiveTab("my-events")}
                       >
                         My Events
                       </button>
                     </li>
                   </ul>


                   {activeTab === "available" && (
                     <div className="d-flex flex-column gap-3">
                       {availableEvents.length > 0 ? (
                         <div className="row g-4">
                           {availableEvents.map((event) => (
                             <div key={event._id} className="col-md-6">
                               <EventCard
                                 title={event.title}
                                 description={event.description}
                                 date={new Date(event.date).toLocaleDateString()}
                                 location={event.location}
                                 ngo={event.ngo}
                                 volunteers={event.volunteers?.length || 0}
                                 maxVolunteers={event.maxVolunteers}
                                 status="open"
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
                         <div className="text-center py-5 border rounded bg-white">
                           <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
                           <p className="text-muted mb-0">No available events at the moment</p>
                         </div>
                       )}
                     </div>
                   )}

                   {activeTab === "my-events" && (
                     <div className="d-flex flex-column gap-3">
                       {myEvents.length > 0 ? (
                         <div className="row g-4">
                           {myEvents.map((event) => (
                             <div key={event._id} className="col-md-6">
                               <EventCard
                                 title={event.title}
                                 description={event.description}
                                 date={new Date(event.date).toLocaleDateString()}
                                 location={event.location}
                                 ngo={event.ngo}
                                 status="registered"
                                 onView={() => {
                                   setSelectedEvent(event);
                                   setShowModal(true);
                                 }}
                               />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="text-center py-5 border rounded bg-white">
                           <i className="bi bi-check-circle fs-1 text-muted mb-3 d-block"></i>
                           <p className="text-muted mb-0">You haven't joined any events yet</p>
                           <button 
                             className="btn btn-success mt-3"
                             onClick={() => setActiveTab("available")}
                           >
                             Browse Events
                           </button>
                         </div>
                       )}
                     </div>
                   )}


                </div>
              </div>
            </div>
          </div>
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

export default VolunteerDashboard;
