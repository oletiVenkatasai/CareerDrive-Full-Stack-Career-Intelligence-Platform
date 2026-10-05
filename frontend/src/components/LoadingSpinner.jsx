import React from 'react';

const LoadingSpinner = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="loading-container">
      <div className="spinner"></div>
      {message && <p>{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', width: '100vw' }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
