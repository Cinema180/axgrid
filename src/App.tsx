import React, { useEffect, useState } from 'react';
import './App.css';
import { Subscription } from 'rxjs';
import { Container, CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Trade } from './types';
import { tradeService } from './services/tradeService';
import TradeContext from './store/TradeContext';
import Navigation from './components/Navigation';

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
    <TradeContext.Provider value={trades}>
      <BrowserRouter>
        <Container>
          <CssBaseline />
          <Navigation />
        </Container>
      </BrowserRouter>
    </TradeContext.Provider>
  );
}

export default App;
