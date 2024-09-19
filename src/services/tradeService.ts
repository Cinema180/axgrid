import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';
import { OfferingDetails, Trade, TradeAction, TradeStatus } from '../types';

export const createTradeService = () => {
  const trades: Trade[] = [];
  const tradesSubject = new BehaviorSubject<Trade[]>(trades);

  const getRandomAction = (actions: TradeAction[]): TradeAction => {
    const index = Math.floor(Math.random() * actions.length);
    return actions[index];
  };

  const updateTradeStatus = (tradeId: string, status: TradeStatus): void => {
    const trade = trades.find((t) => t.id === tradeId);
    if (trade) {
      trade.status = status;
      tradesSubject.next([...trades]);
    }
  };

  const simulateStatusUpdate = (trade: Trade): void => {
    const delay = 2000;

    setTimeout(() => {
      if (trade.status === 'pending') {
        const action = getRandomAction(['proceed', 'cancel']);
        if (action === 'cancel') {
          updateTradeStatus(trade.id, 'cancelled');
          return;
        }
        updateTradeStatus(trade.id, 'processing');
      }

      setTimeout(() => {
        if (trade.status === 'processing') {
          const action = getRandomAction([
            'await confirmation',
            'reject',
            'fail',
          ]);
          if (action === 'reject') {
            updateTradeStatus(trade.id, 'rejected');
            return;
          }
          if (action === 'fail') {
            updateTradeStatus(trade.id, 'failed');
            return;
          }

          updateTradeStatus(trade.id, 'awaiting confirmation');
        }
      }, delay);
    }, delay);
  };

  const addTrade = (offeringDetails: OfferingDetails): void => {
    const newTrade: Trade = {
      id: uuidv4(),
      status: 'pending',
      offeringDetails,
    };
    trades.push(newTrade);
    tradesSubject.next([...trades]);

    // Start simulating status updates with random actions
    simulateStatusUpdate(newTrade);
  };

  const confirmTrade = (tradeId: string): void => {
    const trade = trades.find((t) => t.id === tradeId);
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
