export type EnergySource =
  | 'solar'
  | 'gas'
  | 'wind'
  | 'hydro'
  | 'kinetic'
  | 'thermal';

export type OfferingDetails = {
  [key: string]: string | number;
  contractTerms: string;
  currency: string;
  energySource: EnergySource;
  energyUnit: string;
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
  amount: number;
  id: string;
  offeringDetails: OfferingDetails;
  status: TradeStatus;
};

export interface TradeContextType {
  addTrade: (trade: Trade) => void;
  trades: Trade[];
}
