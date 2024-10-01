import { screen } from '@testing-library/react';
import { of, throwError } from 'rxjs';
import { tradeService } from './services/tradeService';
import mockTrades from './services/mockTrades';
import { renderComponentWithRouter, renderComponent } from './App.test.helpers';

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

    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore the console.error mock after each test
  });

  test('renders navigation tabs and routes to TradeManager', () => {
    // Render the App component
    renderComponent();

    // Check that the navigation tabs are rendered
    expect(screen.getByText('Trade Manager')).toBeInTheDocument();
    expect(screen.getByText('New Trade')).toBeInTheDocument();

    // Check that it redirects to the TradeManager page
    expect(screen.getByText('Manage Trades')).toBeInTheDocument();
  });

  test('renders TradeForm when navigating to /new-trade', () => {
    // Render the App with router and initial route set to '/new-trade'
    renderComponentWithRouter('/new-trade');

    // Check that the TradeForm is rendered
    expect(screen.getByText('Create a New Trade')).toBeInTheDocument();
  });

  test('subscribes to tradeService.getTrades() and updates trades in TradeContext', () => {
    // Render the App with router and initial route set to '/'
    renderComponentWithRouter('/');

    // Ensure tradeService.getTrades() is called
    expect(tradeService.getTrades).toHaveBeenCalled();

    // Check that trades are provided in the TradeContext to be available throughout the app
    expect(screen.getByText(mockTrades[0].id)).toBeInTheDocument();
  });

  test('handles tradeService subscription error gracefully', () => {
    // Mock the getTrades service to throw an error
    (tradeService.getTrades as jest.Mock).mockReturnValue(
      throwError(() => new Error()) // Use throwError to simulate the error
    );

    // Render the App component
    renderComponent();

    // Check if the error was logged to the console
    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch trades:',
      expect.any(Error)
    );
  });
});
