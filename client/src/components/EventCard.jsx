import DonateButton from "./DonateButton";

const EventCard = ({
  title,
  description,
  date,
  location,
  ngo,
  volunteers = 0,
  maxVolunteers,
  status = "open",
  onJoin,
  onView,
  showActions = true,
  showDonate = true,
  eventId,
}) => {
  const statusBadges = {
    open: "bg-success bg-opacity-10 text-success border border-success border-opacity-25",
    full: "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25",
    completed: "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25",
  };

  const statusLabels = {
    open: "Open",
    full: "Full",
    completed: "Completed",
  };

  return (
    <div className="card h-100 border-1 shadow-sm card-hover">
      {/* Card Header */}
      <div className="card-header bg-light bg-opacity-50 border-bottom-0 pt-3 px-3">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title fw-semibold text-truncate mb-0" style={{ maxWidth: '75%' }}>
            {title}
          </h5>
          <span className={`badge rounded-pill fw-normal ${statusBadges[status] || 'bg-secondary'}`}>
            {statusLabels[status]}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <p className="card-text text-muted small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description}
        </p>

        <div className="d-flex flex-column gap-2 small">
          <div className="d-flex align-items-center gap-2 text-muted">
            <i className="bi bi-calendar text-success"></i>
            <span>{date}</span>
          </div>
          <div className="d-flex align-items-center gap-2 text-muted">
            <i className="bi bi-geo-alt text-success"></i>
            <span>{location}</span>
          </div>
          <div className="d-flex align-items-center gap-2 text-muted">
            <i className="bi bi-building text-success"></i>
            <span className="fw-medium">{ngo?.name || "Unknown NGO"}</span>
          </div>

          {maxVolunteers && (
            <div className="d-flex align-items-center gap-2 text-muted">
              <i className="bi bi-people text-success"></i>
              <span>{volunteers} / {maxVolunteers} volunteers</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      {showActions && (
        <div className="card-footer bg-transparent border-top-0 pb-3 px-3">
          <div className="d-flex gap-2">
            {showDonate && (
              <DonateButton ngoId={ngo?._id} ngoName={ngo?.name} eventTitle={title} eventId={eventId} />
            )}
            {onView && (
              <button className="btn btn-outline-success btn-sm flex-grow-1" onClick={onView}>
                View Details
              </button>
            )}
            {onJoin && status === "open" && (
              <button className="btn btn-success btn-sm flex-grow-1" onClick={onJoin}>
                Join Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
