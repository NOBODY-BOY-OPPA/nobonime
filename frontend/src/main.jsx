import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import './styles.css';
import './styles/variables.css';
import './styles/reset.css';
import './styles/glassmorphism.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter><App /></BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
