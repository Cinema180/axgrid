import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import TradeForm from './components/TradeForm';
import TradeManager from './components/TradeManager';

// Render the App component with router
export default function renderComponentWithRouter(path: string) {
  render(
    <App
      router={
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/" element={<Navigate to="/trade-manager" />} />
            <Route path="/trade-manager" element={<TradeManager />} />
            <Route path="/new-trade" element={<TradeForm />} />
          </Routes>
        </MemoryRouter>
      }
    />
  );
}
