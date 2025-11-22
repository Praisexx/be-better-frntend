import React from 'react';
import { Loader } from 'lucide-react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', fullScreen = false }) => {
  const sizeMap = {
    small: 24,
    medium: 48,
    large: 64
  };

  const iconSize = sizeMap[size] || sizeMap.medium;

  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className="loading-spinner-content">
          <Loader className="spinner-icon" size={iconSize} />
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-spinner ${size}`}>
      <Loader className="spinner-icon" size={iconSize} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
