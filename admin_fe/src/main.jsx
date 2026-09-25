import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'react-phone-number-input/style.css';
import './index.css';
import App from './App';
import AppProviders from './providers/AppProviders';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
