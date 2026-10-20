import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FocusTimerProvider } from './context/FocusTimerContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FocusTimerProvider>
            <AppRoutes />
          </FocusTimerProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
