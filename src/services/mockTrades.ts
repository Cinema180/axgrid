import { Trade } from '../types/tradeTypes';

const mockTrades: Trade[] = [
  {
    id: '52e8753c-3620-4347-b0a4-b51e237b50b7',
    status: 'pending',
    offeringDetails: {
      currency: 'CNY',
      energySource: 'solar',
      energyUnit: 'MWh',
      price: 35,
      contractTerms: '12 months, auto-renewal',
      minPurchaseQuantity: 10,
      paymentTerms: '2%/10 Net 30',
      capacity: '25000 MW',
      location: 'Golmud, China',
      energyOutputPredictions: 'good',
      timeOfAvailability: 'daytime',
      certifications: 'RECs',
    },
  },
  {
    id: '62d794a8-e6da-4113-a778-662a6a02289c',
    status: 'pending',
    offeringDetails: {
      currency: 'USD',
      energySource: 'gas',
      energyUnit: 'MMBtu',
      price: 3,
      contractTerms: '3 years, early termination allowed',
      minPurchaseQuantity: 15,
      paymentTerms: '1%/10 Net 90',
      capacity: '200 MMcf/d',
      deliveryMethod: 'pipeline',
      flexibilityOfSupply: 'high',
      emissionCreditsOrPenalties: 'none',
      contractLength: '3 years',
    },
  },
  {
    id: '99a1009b-7c05-49e5-a34b-9abd79e86ee4',
    status: 'awaiting confirmation',
    offeringDetails: {
      currency: 'USD',
      energySource: 'wind',
      energyUnit: 'MWh',
      price: 25,
      contractTerms: '24 months, penalty for early termination',
      minPurchaseQuantity: 20,
      paymentTerms: 'Net 60',
      capacity: 10000,
      location: 'Texas, USA',
      windSpeedPredictions: 'good',
      turbineEfficiency: 'high',
      certifications: 'Green-e',
    },
  },
];

export default mockTrades;
