import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import TradeForm from './TradeForm';
import formConfig from '../resources/formConfig.json';
import { tradeService } from '../services/tradeService';
import * as TradeFormHelpers from './TradeForm.helpers';
import renderWithProviders from './TradeForm.test.helpers';

// Mock the tradeService
jest.mock('../services/tradeService', () => ({
  tradeService: {
    addTrade: jest.fn(),
  },
}));

describe('TradeForm', () => {
  let initialiseFormData: jest.SpyInstance;

  beforeEach(() => {
    initialiseFormData = jest.spyOn(TradeFormHelpers, 'initialiseFormData');
    jest.clearAllMocks();
  });

  afterEach(() => {
    initialiseFormData.mockRestore();
  });

  test('renders the form with common and solar-specific fields by default', () => {
    // Render the TradeForm component
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
    // Render the TradeForm component
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
    // Render the TradeForm component
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
    // Render the TradeForm component (the default energy source is solar)
    renderWithProviders(<TradeForm />);

    // Check the common fields are rendered
    formConfig.commonFields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });

    // Check the default energy source's (solar) specific fields are rendered
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
    // Render the TradeForm component
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

  test('updates formData when input fields are changed', () => {
    // Mock initialiseFormData return value
    initialiseFormData.mockReturnValue({
      price: '100',
      contractTerms: 'Short-term',
    });

    // Render the TradeForm component
    renderWithProviders(<TradeForm />);

    // Find the price field, check its current value, and simulate a change event
    const priceInput = screen.getByLabelText('Price');
    expect(priceInput).toHaveValue(100);
    fireEvent.change(priceInput, { target: { value: '200' } });

    // Find the contract terms field, check its current value, and simulate a change event
    const contractTermsInput = screen.getByLabelText('Contract Terms');
    expect(contractTermsInput).toHaveValue('Short-term');
    fireEvent.change(contractTermsInput, { target: { value: 'Long-term' } });

    // Assert that the input values has been updated
    expect(priceInput).toHaveValue(200);
    expect(contractTermsInput).toHaveValue('Long-term');
  });

  test('resets the form after submitting a trade', () => {
    // Render the TradeForm component
    renderWithProviders(<TradeForm />);

    // Set some initial form values for a common field and a dynamic field
    const priceInput = screen.getByLabelText('Price');
    fireEvent.change(priceInput, { target: { value: '100' } });

    const contractTermsInput = screen.getByLabelText('Contract Terms');
    fireEvent.change(contractTermsInput, { target: { value: 'Long-term' } });

    // Click the "Submit Trade" button to open the confirmation dialog
    const submitButton = screen.getByText('Submit Trade');
    fireEvent.click(submitButton);

    // Click the "OK" button in the confirmation dialog to confirm
    const confirmButton = screen.getByText('OK');
    fireEvent.click(confirmButton);

    // Ensure the tradeService.addTrade was called to submit the trade
    expect(tradeService.addTrade).toHaveBeenCalled();

    // Check that TradeForm.helpers.initialiseFormData was called to reset the form
    expect(initialiseFormData).toHaveBeenCalled();
  });
});
