import React from 'react';
import { render, screen } from '@testing-library/react';
import { of } from 'rxjs';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { tradeService } from './services/tradeService';
import App from './App';
import mockTrades from './services/mockTrades';
import TradeForm from './components/TradeForm';
import TradeManager from './components/TradeManager';

// Mock the tradeService to avoid real API calls
jest.mock('./services/tradeService', () => ({
  tradeService: {
    getTrades: jest.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    // Mock the getTrades service to return initial trades before each test
    (tradeService.getTrades as jest.Mock).mockReturnValue(of(mockTrades));
    jest.clearAllMocks();
  });

  test('renders navigation tabs and routes to TradeManager', () => {
    // Render the component
    render(<App />);

    // Check that the navigation tabs are rendered
    expect(screen.getByText('Trade Manager')).toBeInTheDocument();
    expect(screen.getByText('New Trade')).toBeInTheDocument();

    // Check that it redirects to the TradeManager page
    expect(screen.getByText('Manage Trades')).toBeInTheDocument();
  });

  test('renders TradeForm when navigating to /new-trade', () => {
    // Render the App with MemoryRouter and initial route set to /new-trade
    render(
      <App
        router={
          <MemoryRouter initialEntries={['/new-trade']}>
            <Routes>
              <Route path="/" element={<Navigate to="/trade-manager" />} />
              <Route path="/trade-manager" element={<TradeManager />} />
              <Route path="/new-trade" element={<TradeForm />} />
            </Routes>
          </MemoryRouter>
        }
      />
    );

    // Check that the TradeForm is rendered
    expect(screen.getByText('Create a New Trade')).toBeInTheDocument();
  });

  test('subscribes to tradeService.getTrades() and updates trades in TradeContext', () => {
    // Render the component
    render(
      <App
        router={
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<Navigate to="/trade-manager" />} />
              <Route path="/trade-manager" element={<TradeManager />} />
              <Route path="/new-trade" element={<TradeForm />} />
            </Routes>
          </MemoryRouter>
        }
      />
    );

    // Ensure tradeService.getTrades() is called
    expect(tradeService.getTrades).toHaveBeenCalled();

    // Check that trades are provided in the TradeContext to be available throughout the app
    expect(screen.getByText(mockTrades[0].id)).toBeInTheDocument();
  });

});
