import React from 'react';
import './index.css';

const ProgressBar = ({ progress = 50 }: { progress: number }) => {
  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
      >
        <div className="flow-effect" />
      </div>
    </div>
  );
};

export default ProgressBar;
