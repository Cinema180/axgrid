import { createContext } from 'react';
import { Trade } from '../types/tradeTypes';

const TradeContext = createContext<Trade[] | undefined>(undefined);

export default TradeContext;
