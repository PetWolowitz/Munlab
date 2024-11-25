import React from 'react';
import '../styles/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Caricamento in corso...</p>
    </div>
  );
};

export default Loader;
