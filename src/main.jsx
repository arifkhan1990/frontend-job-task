import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { QueryProvider } from './app/QueryProvider.jsx';
import { ThemeProvider } from './app/ThemeProvider.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './i18n/index.js';
import './styles.css';
import './styles/tokens.css';
import './styles/base.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
