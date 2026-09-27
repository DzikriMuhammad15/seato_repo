import React from 'react';

export default function DeviceFrame({ children, activeTab }) {
  const isDarkText = activeTab === 'explore' || activeTab === 'reservasi';

  return (
    <div className="device-frame">
      <div className="dynamic-island"></div>
      <div className={`status-bar ${isDarkText ? 'dark-text' : ''}`}>
        <span>9:41</span>
        <div className="status-icons">
          <i className="ti ti-cell"></i>
          <i className="ti ti-wifi"></i>
          <i className="ti ti-battery-filled"></i>
        </div>
      </div>
      {children}
    </div>
  );
}
