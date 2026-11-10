import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import App from './App.jsx';
import { AuthProvider } from './auth.jsx';
import { LangProvider } from './i18n.jsx';
import { SettingsProvider } from './settings.js';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LangProvider>
      <SettingsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SettingsProvider>
    </LangProvider>
  </BrowserRouter>
);
