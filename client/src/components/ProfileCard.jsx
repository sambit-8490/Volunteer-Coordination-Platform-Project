const ProfileCard = ({ name, email, role, joinedEvents, totalEvents, avatar }) => {
  const roleLabels = {
    volunteer: "Volunteer",
    ngo: "NGO Partner",
    admin: "Administrator",
  };

  const roleBadges = {
    volunteer: "bg-success-subtle text-success border-success-subtle",
    ngo: "bg-warning-subtle text-warning border-warning-subtle",
    admin: "bg-danger-subtle text-danger border-danger-subtle",
  };

  return (
    <div className="card border-1 shadow-sm overflow-hidden">
      {/* Header with gradient */}
      <div className="gradient-hero" style={{ height: '80px' }} />

      {/* Profile Content */}
      <div className="card-body pt-0 px-4 pb-4">
        {/* Avatar */}
        <div className="d-flex justify-content-between align-items-end mb-3" style={{ marginTop: '-40px' }}>
          <div className="bg-white p-1 rounded-circle">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '80px', height: '80px' }}>
              {avatar ? (
                <img src={avatar} alt={name} className="rounded-circle w-100 h-100 object-fit-cover" />
              ) : (
                <i className="bi bi-person text-secondary fs-1"></i>
              )}
            </div>
          </div>
          <span className={`badge border ${roleBadges[role] || 'bg-light text-dark'}`}>
            {roleLabels[role]}
          </span>
        </div>

        {/* Info */}
        <div className="mb-4">
          <h4 className="fw-bold mb-1">{name}</h4>
          <div className="d-flex align-items-center gap-2 text-muted small">
            <i className="bi bi-envelope"></i>
            <span>{email}</span>
          </div>
        </div>

        {/* Stats */}
        {(joinedEvents !== undefined || totalEvents !== undefined) && (
          <div className="d-flex gap-4 border-top pt-3">
            {joinedEvents !== undefined && (
              <div className="text-center">
                <h5 className="fw-bold text-success mb-0">{joinedEvents}</h5>
                <small className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>Joined Events</small>
              </div>
            )}
            {totalEvents !== undefined && (
              <div className="text-center">
                <h5 className="fw-bold text-secondary mb-0">{totalEvents}</h5>
                <small className="text-muted fw-medium" style={{ fontSize: '0.90rem' }}>Total Events</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
