import { createContext } from 'react';
import { Trade } from '../types/types';

const TradeContext = createContext<Trade[] | undefined>(undefined);

export default TradeContext;
