import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { of } from 'rxjs';
import { tradeService } from '../services/tradeService';
import TradeManager from './TradeManager';
import mockTrades from '../services/mockTrades';

// Mock the tradeService
jest.mock('../services/tradeService', () => ({
  tradeService: {
    getTrades: jest.fn(),
    confirmTrade: jest.fn(),
  },
}));

describe('TradeManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the getTrades service for all tests
    (tradeService.getTrades as jest.Mock).mockReturnValue(of(mockTrades));
  });

  const renderComponent = () => render(<TradeManager />);

  const getTradeRowById = (tradeId: string): HTMLElement => {
    const tradeRow = screen
      .getByText(tradeId)
      .closest('div[role="row"]') as HTMLElement;
    return tradeRow;
  };

  test('renders the TradeManager component and loads trades', () => {
    renderComponent();

    // Check if the main heading "Manage Trades" is displayed
    expect(screen.getByText('Manage Trades')).toBeInTheDocument();

    // Check if at least one trade from initialTrades is displayed
    expect(screen.getByText(mockTrades[0].id)).toBeInTheDocument();
  });

  test('opens TradeDetailDialog when "View Details" is clicked for the first trade', () => {
    renderComponent();

    // Get the row for the first trade
    const tradeRow = getTradeRowById(mockTrades[0].id);

    // Find and click the "View Details" button within that row
    const viewDetailsButton = within(tradeRow).getByLabelText(
      "View this trade's details"
    );
    fireEvent.click(viewDetailsButton);

    // Ensure the TradeDetailDialog opens
    expect(screen.getByText('Trade Details')).toBeInTheDocument();
  });

  test('opens confirmation dialog when "Trade" is clicked and confirms the trade', () => {
    renderComponent();

    // Find the first trade with status 'awaiting confirmation'
    const awaitingConfirmationTrade = mockTrades.find(
      (trade) => trade.status === 'awaiting confirmation'
    );

    // Ensure a trade with this status exists in the mock data
    expect(awaitingConfirmationTrade).toBeDefined();

    // Get the row for this trade
    const tradeRow = getTradeRowById(awaitingConfirmationTrade!.id);

    // Find and click the "Confirm Trade" button within that row
    const confirmTradeButton =
      within(tradeRow).getByLabelText('Confirm this trade');
    fireEvent.click(confirmTradeButton);

    // Ensure the confirmation dialog is opened
    expect(
      screen.getByText('Are you sure you want to confirm this trade?')
    ).toBeInTheDocument();

    // Click the "OK" button to confirm the trade
    fireEvent.click(screen.getByText('OK'));

    // Ensure the confirmTrade function is called with the correct trade ID
    expect(tradeService.confirmTrade).toHaveBeenCalledWith(
      awaitingConfirmationTrade!.id
    );
  });
});
