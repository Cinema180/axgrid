import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfferingDetails, Trade, TradeStatus } from '../types/types';
import initialTrades from './initialTrades';

// WebSocket URL (replace with actual WebSocket endpoint or use a mock)
const WS_URL = 'wss://your-websocket-server-url';

export const createTradeService = () => {
  const tradesSubject = new BehaviorSubject<Trade[]>(initialTrades);
  const socket = new WebSocket(WS_URL);

  // Function to update trade status
  const updateTradeStatus = (tradeId: string, status: TradeStatus): void => {
    const currentTrades = tradesSubject.getValue();
    const trade = currentTrades.find((t) => t.id === tradeId);
    if (trade) {
      trade.status = status;
      tradesSubject.next([...currentTrades]);
    }
  };

  // WebSocket message stream
  const socketObservable = fromEvent<MessageEvent>(socket, 'message').pipe(
    map((event: MessageEvent) => {
      const updatedTrade = JSON.parse(event.data) as Trade;
      const currentTrades = tradesSubject.getValue();
      const tradeIndex = currentTrades.findIndex(
        (t) => t.id === updatedTrade.id
      );
      if (tradeIndex !== -1) {
        currentTrades[tradeIndex] = updatedTrade;
      } else {
        currentTrades.push(updatedTrade);
      }
      tradesSubject.next([...currentTrades]);
      return [...currentTrades];
    })
  );

  // Function to progress trade statuses
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
    // Handle 'awaiting confirmation' status - do nothing unless user confirms
    else if (trade.status === 'awaiting confirmation') {
      return; // Remain in 'awaiting confirmation' until user confirms the trade
    }
  };

  // Progress all trades in their logical order
  const updateAllTradeStatuses = (): void => {
    const currentTrades = tradesSubject.getValue();
    currentTrades.forEach(simulateTradeStatusProgression);
    tradesSubject.next([...currentTrades]);
  };

  setInterval(() => {
    updateAllTradeStatuses();
  }, 10000); // Update every 10 seconds

  // Add a new trade
  const addTrade = (offeringDetails: OfferingDetails): void => {
    const newTrade: Trade = {
      id: uuidv4(),
      status: 'pending',
      offeringDetails,
    };
    const currentTrades = tradesSubject.getValue();
    currentTrades.push(newTrade);
    tradesSubject.next([...currentTrades]);

    // The trade will be updated by the WebSocket and RxJS streams
  };

  // Confirm a trade
  const confirmTrade = (tradeId: string): void => {
    const currentTrades = tradesSubject.getValue();
    const trade = currentTrades.find((t) => t.id === tradeId);
    if (trade && trade.status === 'awaiting confirmation') {
      updateTradeStatus(tradeId, 'completed');
    }
  };

  // Merge WebSocket stream with existing RxJS trades stream
  const getTrades = (): Observable<Trade[]> =>
    merge(tradesSubject.asObservable(), socketObservable).pipe(
      map((trades: Trade | Trade[]) =>
        Array.isArray(trades) ? trades : [trades]
      )
    );

  return {
    addTrade,
    confirmTrade,
    getTrades,
  };
};

export const tradeService = createTradeService();
