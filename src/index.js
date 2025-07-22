import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NewApp from './components/NewApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NewApp />
  </React.StrictMode>
);
