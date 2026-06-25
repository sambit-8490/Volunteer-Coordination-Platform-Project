import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCard from "@/components/StatsCard";
import { useState, useEffect } from "react";
import API, { getErrorMessage } from "../api";
import { useToast } from "../context/ToastContext";

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card mb-4" style={{ border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="card-header bg-white d-flex w-100 align-items-center justify-content-between text-start btn btn-link text-decoration-none"
        style={{ borderBottom: isOpen ? '1px solid #e5e7eb' : 'none', borderRadius: '12px', padding: '16px 20px' }}
      >
        <h3 className="h6 fw-semibold text-dark mb-0" style={{ fontSize: '15px' }}>{title}</h3>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} text-muted`}></i>
      </button>
      {isOpen && <div className="card-body px-4 pb-3 pt-3">{children}</div>}
    </div>
  );
};

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNGOs: 0,
    totalEvents: 0,
    totalDonations: 0,
  });
  const [pendingNGOs, setPendingNGOs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all data in parallel
      const [usersRes, ngosRes, eventsRes, donationsRes] = await Promise.all([
        API.get('/user'),
        API.get('/admin/ngos'),
        API.get('/event'),
        API.get('/donate')
      ]);

      console.log('Admin Dashboard API Responses:', {
        users: usersRes.data,
        ngos: ngosRes.data,
        events: eventsRes.data,
        donations: donationsRes.data
      });

      // Extract data from responses (handle different formats)
      const users = usersRes.data.data || usersRes.data || [];
      const ngos = Array.isArray(ngosRes.data) ? ngosRes.data : (ngosRes.data.data || []);
      const events = eventsRes.data.data || eventsRes.data || [];
      const donations = donationsRes.data.data || donationsRes.data || [];

      console.log('Extracted Data:', {
        usersCount: users.length,
        ngosCount: ngos.length,
        eventsCount: events.length,
        donationsCount: donations.length
      });

      // Calculate stats
      const completedDonations = donations.filter(d => d.paymentStatus === 'completed');
      const totalDonationAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);

      setStats({
        totalUsers: users.length,
        totalNGOs: ngos.length,
        totalEvents: events.length,
        totalDonations: totalDonationAmount,
      });

      // Set pending NGOs (filter by status)
      const pendingNGOs = ngos.filter(ngo => ngo.status === 'pending');
      console.log('Pending NGOs:', pendingNGOs);
      setPendingNGOs(pendingNGOs);

      // Set all data (sorted by newest first)
      setAllUsers(users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setAllEvents(events.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)));
      setAllDonations(donations);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveNGO = async (ngoId) => {
    try {
      await API.put(`/ngo/${ngoId}/approve`);
      showToast("NGO approved successfully!", "success");
      // Refresh data
      fetchAllData();
    } catch (err) {
      showToast(getErrorMessage(err), "danger");
    }
  };

  const handleRejectNGO = async (ngoId) => {
    try {
      await API.put(`/admin/approve/${ngoId}`, { status: 'rejected' });
      showToast("NGO rejected", "warning");
      // Refresh data
      fetchAllData();
    } catch (err) {
      showToast(getErrorMessage(err), "danger");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await API.delete(`/user/${userId}`);
      showToast("User deleted successfully", "success");
      // Refresh data
      fetchAllData();
    } catch (err) {
      showToast(getErrorMessage(err), "danger");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await API.delete(`/event/${eventId}`);
      showToast("Event deleted successfully", "success");
      // Refresh data
      fetchAllData();
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
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <DashboardHeader
        title="Admin Panel"
        subtitle="Manage all NGOs, users, events, and donations here."
        userName="Admin"
      />

      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Stats Grid */}
          <div className="row g-4 mb-5">
            <div className="col-sm-6 col-lg-3">
              <StatsCard
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                icon="bi-people"
                variant="primary"
              />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatsCard
                title="Total NGOs"
                value={stats.totalNGOs}
                icon="bi-building"
                variant="secondary"
              />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatsCard
                title="Total Events"
                value={stats.totalEvents}
                icon="bi-calendar-event"
                variant="success"
              />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatsCard
                title="Total Donations"
                value={`₹${stats.totalDonations.toLocaleString()}`}
                icon="bi-currency-rupee"
                variant="warning"
              />
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="d-flex flex-column gap-3">
            {/* NGO Approvals */}
            <CollapsibleSection title="NGO Approvals" defaultOpen>
              {pendingNGOs.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {pendingNGOs.map((ngo) => (
                    <div
                      key={ngo._id}
                      className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3"
                      style={{ padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff' }}
                    >
                      <div>
                        <h6 className="fw-semibold mb-1" style={{ fontSize: '14px', color: '#111827' }}>{ngo.name}</h6>
                        <p className="mb-1" style={{ fontSize: '13px', color: '#0891b2' }}>{ngo.email}</p>
                        <p className="mb-0" style={{ fontSize: '12px', color: '#d97706' }}>Applied: {new Date(ngo.createdAt).toLocaleDateString('en-CA')}</p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success d-flex align-items-center gap-1"
                          style={{ fontSize: '13px', padding: '5px 14px', borderRadius: '6px' }}
                          onClick={() => handleApproveNGO(ngo._id)}
                        >
                          <i className="bi bi-check-lg"></i> Approve
                        </button>
                        <button
                          className="btn btn-sm d-flex align-items-center gap-1"
                          style={{ fontSize: '13px', padding: '5px 14px', borderRadius: '6px', color: '#dc2626', border: '1px solid #dc2626', background: 'transparent' }}
                          onClick={() => handleRejectNGO(ngo._id)}
                        >
                          <i className="bi bi-x-lg"></i> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted py-4 mb-0">No pending approvals</p>
              )}
            </CollapsibleSection>

            {/* All Users */}
            <CollapsibleSection title="All Users">
              <div className="table-responsive">
                <table className="table align-middle mb-0" style={{ fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Name</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Email</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Role</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Status</th>
                      <th className="fw-bold pb-2 text-end" style={{ color: '#6b7280', borderBottom: 'none' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <tr key={user._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td className="fw-semibold py-3" style={{ color: '#111827' }}>{user.name}</td>
                        <td className="py-3" style={{ color: '#6b7280' }}>{user.email}</td>
                        <td className="py-3">
                          <span className="text-capitalize" style={{ fontSize: '12px', padding: '3px 10px', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', background: '#fff' }}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span style={{
                            fontSize: '12px',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: user.onboardingCompleted ? '#dcfce7' : '#f3f4f6',
                            color: user.onboardingCompleted ? '#15803d' : '#6b7280'
                          }}>
                            {user.onboardingCompleted ? 'active' : 'inactive'}
                          </span>
                        </td>
                        <td className="py-3 text-end">
                          <button
                            className="btn btn-sm"
                            style={{ color: '#dc2626', background: 'none', border: 'none', padding: '2px 6px' }}
                            onClick={() => handleDeleteUser(user._id)}
                            title="Delete user"
                          >
                            <i className="bi bi-trash" style={{ fontSize: '15px' }}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            {/* All Events */}
            <CollapsibleSection title="All Events">
              <div className="table-responsive">
                <table className="table align-middle mb-0" style={{ fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Title</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>NGO</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Date</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Volunteers</th>
                      <th className="fw-bold pb-2 text-end" style={{ color: '#6b7280', borderBottom: 'none' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allEvents.map((event) => (
                      <tr key={event._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td className="fw-semibold py-3" style={{ color: '#111827' }}>{event.title}</td>
                        <td className="py-3" style={{ color: '#6b7280' }}>{event.ngo?.name || 'N/A'}</td>
                        <td className="py-3" style={{ color: '#6b7280' }}>{new Date(event.date).toLocaleDateString('en-CA')}</td>
                        <td className="py-3" style={{ color: '#6b7280' }}>{event.volunteers?.length || 0}</td>
                        <td className="py-3 text-end">
                          <button
                            className="btn btn-sm"
                            style={{ color: '#dc2626', background: 'none', border: 'none', padding: '2px 6px' }}
                            onClick={() => handleDeleteEvent(event._id)}
                            title="Delete event"
                          >
                            <i className="bi bi-trash" style={{ fontSize: '15px' }}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            {/* All Donations */}
            <CollapsibleSection title="All Donations">
              <div className="table-responsive">
                <table className="table align-middle mb-0" style={{ fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Donor</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Amount</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>NGO</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Event</th>
                      <th className="fw-bold pb-2" style={{ color: '#6b7280', borderBottom: 'none' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDonations.map((donation) => (
                      <tr key={donation._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td className="fw-semibold py-3" style={{ color: '#111827' }}>{donation.donor?.name || 'Anonymous'}</td>
                        <td className="fw-semibold py-3" style={{ color: '#16a34a' }}>₹{donation.amount?.toLocaleString()}</td>
                        <td className="py-3" style={{ color: '#6b7280' }}>{donation.ngo?.name || 'N/A'}</td>
                        <td className="py-3" style={{ color: '#6b7280' }}>
                          {donation.event?.title ? (
                            <span className="d-flex align-items-center gap-1">
                              <i className="bi bi-calendar-event small" style={{ color: '#0891b2' }}></i>
                              {donation.event.title}
                            </span>
                          ) : (
                            <span className="fst-italic">Direct</span>
                          )}
                        </td>
                        <td className="py-3" style={{ color: '#6b7280' }}>{new Date(donation.createdAt).toLocaleDateString('en-CA')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
