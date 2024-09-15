import React from 'react';
import './App.css';
import axpLogo from './resources/axgrid_logo_transparent_medium.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={axpLogo} className="App-logo" alt="logo" />
        <p>
          Welcome to AxGrid, the most unpredictable yet exciting energy trading
          platform.
        </p>
      </header>
    </div>
  );
}

export default App;
