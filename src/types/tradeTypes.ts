import { EnergySource } from './commonTypes'; // Assuming EnergySource is defined in commonTypes.ts

export type OfferingDetails = {
  [key: string]: string | number;
  contractTerms: string;
  currency: string;
  energySource: EnergySource;
  minPurchaseQuantity: number;
  paymentTerms: string;
  price: number;
};

export type TradeAction =
  | 'proceed'
  | 'cancel'
  | 'reject'
  | 'fail'
  | 'await confirmation';

export type TradeStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'amended'
  | 'failed'
  | 'awaiting confirmation';

export type Trade = {
  id: string;
  offeringDetails: OfferingDetails;
  status: TradeStatus;
};

export interface TradeContextType {
  addTrade: (trade: Trade) => void;
  trades: Trade[];
}

