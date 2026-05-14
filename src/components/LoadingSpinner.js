import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'Loading' }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span className="spinner-text">{text}...</span>
    </div>
  );
};

export default LoadingSpinner;
