import React from 'react';

const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default LoadingFallback;
