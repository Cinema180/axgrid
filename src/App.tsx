import React, { useEffect, useState } from 'react';
import './App.css';
import { Subscription } from 'rxjs';
import axpLogo from './resources/axgrid_logo_transparent_medium.png';
import { Trade } from './types';
import { tradeService } from './services/tradeService';
import TradeContext from './store/TradeContext';

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
      <div className="App">
        <header className="App-header">
          <img src={axpLogo} className="App-logo" alt="logo" />
          <p>
            Welcome to AxGrid, the most unpredictable yet exciting energy
            trading platform.
          </p>
        </header>
      </div>
    </TradeContext.Provider>
  );
}

export default App;
