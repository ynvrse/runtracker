import React from 'react';
import ReactDOM from 'react-dom/client';

import 'leaflet/dist/leaflet.css';

import App from './App.tsx';
import './index.css';

// <-- Add this line

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
