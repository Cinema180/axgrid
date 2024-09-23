export type EnergySource =
  | 'solar'
  | 'gas'
  | 'wind'
  | 'hydro'
  | 'kinetic'
  | 'thermal';

export interface EnergySourceConfig {
  fields: FormField[];
}

export type FieldType = 'text' | 'number' | 'select'; // Extend this with other required field types like 'select', 'checkbox', etc.

export interface FormField {
  label: string;
  name: string;
  required?: boolean;
  type: FieldType;
  options?: string[];
}

export interface FormConfig {
  [energySource: string]: EnergySourceConfig | FormField[];
  commonFields: FormField[];
}

export interface FormData {
  [key: string]: string | number;
}

export type OfferingDetails = {
  [key: string]: string | number;
  contractTerms: string;
  currency: string;
  energySource: string;
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
