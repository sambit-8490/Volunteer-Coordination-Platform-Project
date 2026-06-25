import { Modal, Button } from "react-bootstrap";
import DonateButton from "./DonateButton";

const EventDetailsModal = ({ show, onHide, event, onJoin }) => {
  if (!event) return null;

  const { title, description, date, location, ngo, volunteers, maxVolunteers, status } = event;
  const ngoData = typeof ngo === 'object' ? ngo : { name: ngo };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0 bg-light">
        <div>
          <Modal.Title className="fw-bold text-success mb-1">{title}</Modal.Title>
          <div className="d-flex align-items-center gap-2 text-muted small">
             <span>{new Date(date).toLocaleDateString()}</span>
             <span>•</span>
             <span>{location}</span>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="p-4">
          <h6 className="fw-bold mb-3">About the Event</h6>
          <p className="text-muted mb-4">{description}</p>
          
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-building text-success"></i>
                  Organization
                </h6>
                <p className="fw-semibold mb-1">{ngoData.name}</p>
                {ngoData.mission && (
                  <p className="small text-muted fst-italic mb-3">"{ngoData.mission}"</p>
                )}
                
                <div className="d-flex flex-column gap-2 small">
                   {ngoData.category && (
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-tag text-muted"></i>
                      <span className="text-capitalize">{ngoData.category}</span>
                    </div>
                  )}
                  {ngoData.website && (
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-globe text-muted"></i>
                      <a href={ngoData.website.startsWith('http') ? ngoData.website : `https://${ngoData.website}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-decoration-none text-success">
                        Visit Website
                      </a>
                    </div>
                  )}
                  {ngoData.phone && (
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-telephone text-muted"></i>
                      <span>{ngoData.phone}</span>
                    </div>
                  )}
                  {ngoData.address && (
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-geo-alt text-muted"></i>
                      <span>{ngoData.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
               <div className="p-3 border rounded-3 h-100">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-info-circle text-success"></i>
                  Status
                </h6>
                
                <div className="mb-3">
                   <div className="d-flex justify-content-between mb-1 small">
                     <span>Volunteers</span>
                     <span className="fw-bold">{volunteers?.length || 0} / {maxVolunteers}</span>
                   </div>
                   <div className="progress" style={{ height: '8px' }}>
                     <div 
                       className="progress-bar bg-success" 
                       role="progressbar" 
                       style={{ width: `${Math.min(((volunteers?.length || 0) / maxVolunteers) * 100, 100)}%` }}
                     ></div>
                   </div>
                </div>

                <div className="d-flex flex-column gap-2 mt-4 pt-3 border-top">
                   <Button 
                     variant="success" 
                     className="w-100 d-flex align-items-center justify-content-center gap-2" 
                     disabled={status !== 'open'}
                     onClick={() => onJoin(event._id)}
                   >
                     {status === 'open' ? (
                        <>
                          <i className="bi bi-person-plus"></i> Join Event
                        </>
                     ) : 'Event Full/Closed'}
                   </Button>
                   <div className="w-100">
                      <DonateButton 
                        ngoId={ngoData._id}
                        ngoName={ngoData.name} 
                        eventTitle={title} 
                        eventId={event._id}
                        className="w-100 justify-content-center" 
                      />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-top-0 bg-light">
        <Button variant="outline-secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetailsModal;
