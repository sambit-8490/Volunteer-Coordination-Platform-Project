import { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success'); // success, danger, warning, info
  const [title, setTitle] = useState('');

  const showToast = useCallback((msg, type = 'success', heading = '') => {
    setMessage(msg);
    setVariant(type);
    setTitle(heading);
    setShow(true);
  }, []);

  const hideToast = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
        <Toast show={show} onClose={hideToast} delay={3000} autohide bg={variant.toLowerCase()}>
           <Toast.Header closeButton>
            <strong className="me-auto">{title || (variant === 'success' ? 'Success' : variant === 'danger' ? 'Error' : 'Notification')}</strong>
          </Toast.Header>
          <Toast.Body className={variant === 'light' ? 'text-dark' : 'text-white'}>
            {message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};
