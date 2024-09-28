import React, { useEffect, useState } from 'react';
import './App.css';
import { Subscription } from 'rxjs';
import { Container, CssBaseline } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Trade } from './types/types';
import { tradeService } from './services/tradeService';
import TradeContext from './store/TradeContext';
import Navigation from './components/Navigation';
import TradeManager from './components/TradeManager';
import TradeForm from './components/TradeForm';
import { TabProvider } from './store/TabContext';

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const subscription: Subscription = tradeService.getTrades().subscribe({
      next: (updatedTrades: Trade[]) => {
        setTrades(updatedTrades);
      },
      error: (err) => {
        console.error('Failed to fetch trades:', err);
      },
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  return (
    <TabProvider>
      <TradeContext.Provider value={trades}>
        <BrowserRouter>
          <Container>
            <CssBaseline />
            <Navigation />
            <Routes>
              <Route path="/" element={<Navigate to="/trade-manager" />} />
              <Route path="/trade-manager" element={<TradeManager />} />
              <Route path="/new-trade" element={<TradeForm />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </TradeContext.Provider>
    </TabProvider>
  );
}

export default App;
