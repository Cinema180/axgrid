export type EnergySource = 'solar' | 'gas' | 'wind' | 'hydro';
export type TradeAction = 'proceed' | 'cancel' | 'reject' | 'fail' | 'await confirmation';
export type TradeStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'amended'
  | 'failed'
  | 'awaiting confirmation';

export interface Trade {
  amount: number;
  energySource: EnergySource;
  id: number;
  status: TradeStatus;
}
