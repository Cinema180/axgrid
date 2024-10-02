import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TabProvider } from '../../store/TabContext';

// Render the App component with router
export default function renderWithProviders(component: React.ReactNode) {
  render(
    <TabProvider>
      <MemoryRouter>{component}</MemoryRouter>
    </TabProvider>
  );
}
