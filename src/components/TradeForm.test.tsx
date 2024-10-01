import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TradeForm from './TradeForm';
import formConfig from '../resources/formConfig.json';
import { TabProvider } from '../store/TabContext';
import { tradeService } from '../services/tradeService';

// Mock the tradeService
jest.mock('../services/tradeService', () => ({
  tradeService: {
    addTrade: jest.fn(),
  },
}));

describe('TradeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactNode) => {
    render(
      <TabProvider>
        <MemoryRouter>{component}</MemoryRouter>
      </TabProvider>
    );
  };

  test('renders the form with common and solar-specific fields by default', () => {
    // Render the component
    renderWithProviders(<TradeForm />);

    // Check that the main heading is rendered
    expect(screen.getByText('Create a New Trade')).toBeInTheDocument();

    // Check the common fields are rendered
    formConfig.commonFields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });

    // Check the solar-specific fields are rendered
    formConfig.solar.fields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });
  });

  test('opens the confirmation dialog when "Submit Trade" is clicked', () => {
    // Render the form
    renderWithProviders(<TradeForm />);

    // Find and click the "Submit Trade" button
    const submitButton = screen.getByText('Submit Trade');
    fireEvent.click(submitButton);

    // Ensure the confirmation dialog opens
    expect(
      screen.getByText('Are you sure you want to submit this trade?')
    ).toBeInTheDocument();
  });

  test('confirms trade submission and calls tradeService.addTrade', () => {
    // Render the form
    renderWithProviders(<TradeForm />);

    // Click "Submit Trade" button to open the confirmation dialog
    const submitButton = screen.getByText('Submit Trade');
    fireEvent.click(submitButton);

    // Ensure the confirmation dialog opens
    expect(
      screen.getByText('Are you sure you want to submit this trade?')
    ).toBeInTheDocument();

    // Click "OK" in the confirmation dialog
    const confirmButton = screen.getByText('OK');
    fireEvent.click(confirmButton);

    // Ensure tradeService.addTrade is called after confirmation
    expect(tradeService.addTrade).toHaveBeenCalled();
  });

  test('updates dynamic fields when the energy source is changed', () => {
    // Render the component with the default energy source (solar)
    renderWithProviders(<TradeForm />);

    // Check the common fields are rendered
    formConfig.commonFields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });

    // Check the solar-specific fields are rendered
    formConfig.solar.fields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });

    // Change the energy source to "wind"
    const energySourceSelect = screen.getByLabelText('Energy Source');
    fireEvent.change(energySourceSelect, { target: { value: 'wind' } });

    // Ensure that the wind-specific fields are rendered
    formConfig.wind.fields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });
  });

  test('opens confirmation dialog and submits the trade on confirmation', () => {
    // Render the component
    renderWithProviders(<TradeForm />);

    // Click the "Submit Trade" button
    const submitButton = screen.getByText('Submit Trade');
    fireEvent.click(submitButton);

    // Ensure the confirmation dialog opens
    expect(
      screen.getByText('Are you sure you want to submit this trade?')
    ).toBeInTheDocument();

    // Click the "OK" button in the confirmation dialog to confirm
    const confirmButton = screen.getByText('OK');
    fireEvent.click(confirmButton);

    // Ensure the tradeService.addTrade was called to submit the trade
    expect(tradeService.addTrade).toHaveBeenCalled();
  });
});
