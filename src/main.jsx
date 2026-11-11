import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { QueryProvider } from './app/QueryProvider.jsx';
import { ThemeProvider } from './app/ThemeProvider.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import { AuthProvider } from './features/auth/AuthProvider.jsx';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/overlay.css';
import './styles/layout.css';
import './styles/table.css';
import './styles/pages.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <QueryProvider>
          <BrowserRouter>
            <AuthProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
