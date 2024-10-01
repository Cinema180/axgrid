import React from 'react';
import { render, screen } from '@testing-library/react';
import { of } from 'rxjs';
import { tradeService } from './services/tradeService';
import App from './App';
import mockTrades from './services/mockTrades';

// Mock the tradeService to avoid real API calls
jest.mock('./services/tradeService', () => ({
  tradeService: {
    getTrades: jest.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation tabs and routes to TradeManager', () => {
    // Mock tradeService to return initial trades
    (tradeService.getTrades as jest.Mock).mockReturnValue(of(mockTrades));

    // Render the component with MemoryRouter on the root route
    render(<App />);

    // Check that the navigation tabs are rendered
    expect(screen.getByText('Trade Manager')).toBeInTheDocument();
    expect(screen.getByText('New Trade')).toBeInTheDocument();

    // Check that it redirects to the TradeManager page
    expect(screen.getByText('Manage Trades')).toBeInTheDocument();
  });
});
