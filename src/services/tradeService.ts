import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';
import initialTrades from './initialTrades';
import { Trade, TradeStatus, OfferingDetails } from '../types/tradeTypes';

export const createTradeService = () => {
  const tradesSubject = new BehaviorSubject<Trade[]>(initialTrades);

  const updateTradeStatus = (tradeId: string, status: TradeStatus): void => {
    const currentTrades = tradesSubject.getValue();
    const trade = currentTrades.find((t) => t.id === tradeId);
    if (trade) {
      trade.status = status;
      tradesSubject.next([...currentTrades]);
    }
  };

  // Function to progress trade statuses in a logical order
  const simulateTradeStatusProgression = (trade: Trade): void => {
    // Handle 'pending' status
    if (trade.status === 'pending') {
      const action = Math.random();
      if (action < 0.7) {
        updateTradeStatus(trade.id, 'pending'); // 70% chance to remain in 'pending'
      } else {
        updateTradeStatus(trade.id, 'processing'); // 30% chance to progress to 'processing'
      }
    }
    // Handle 'processing' status
    else if (trade.status === 'processing') {
      const action = Math.random();
      if (action < 0.6) {
        updateTradeStatus(trade.id, 'processing'); // 50% chance to remain in 'processing'
      } else if (action < 0.8) {
        updateTradeStatus(trade.id, 'awaiting confirmation'); // 20% chance to progress to 'awaiting confirmation'
      } else if (action < 0.95) {
        updateTradeStatus(trade.id, 'rejected'); // 15% chance to be 'rejected'
      } else {
        updateTradeStatus(trade.id, 'failed'); // 5% chance to be 'failed'
      }
    }
    // Handle 'awaiting confirmation' status
    else if (trade.status === 'awaiting confirmation') {
      // Remain in 'awaiting confirmation' until user confirms the trade
    }
  };

  // Progress the status of all trades in their logical order
  const updateAllTradeStatuses = (): void => {
    const currentTrades = tradesSubject.getValue();
    const updatedTrades = currentTrades.map((trade) => {
      simulateTradeStatusProgression(trade);
      return trade;
    });
    tradesSubject.next([...updatedTrades]);
  };

  // Start the interval to update trades progressively
  setInterval(() => {
    updateAllTradeStatuses();
  }, 10000); // Updates every 10 seconds

  const addTrade = (offeringDetails: OfferingDetails): void => {
    const newTrade: Trade = {
      id: uuidv4(),
      status: 'pending',
      offeringDetails,
    };
    const currentTrades = tradesSubject.getValue();
    currentTrades.push(newTrade);
    tradesSubject.next([...currentTrades]);
  };

  const confirmTrade = (tradeId: string): void => {
    const currentTrades = tradesSubject.getValue();
    const trade = currentTrades.find((t) => t.id === tradeId);
    if (trade && trade.status === 'awaiting confirmation') {
      updateTradeStatus(tradeId, 'completed');
    }
  };

  const getTrades = (): Observable<Trade[]> => tradesSubject.asObservable();

  return {
    addTrade,
    confirmTrade,
    getTrades,
  };
};

export const tradeService = createTradeService();
