import { EnergySource } from '../types/commonTypes';
import { OfferingDetails } from '../types/tradeTypes';
import formConfig from '../resources/formConfig.json';

export const getFieldLabel = (
  key: string,
  energySource: EnergySource,
  offeringDetails: OfferingDetails
): string => {
  const commonField = formConfig.commonFields.find(
    (field: { name: string }) => field.name === key
  );

  if (key === 'price' && offeringDetails.currency) {
    return `Price (${offeringDetails.currency})`;
  }

  if (commonField) return commonField.label;

  const energyFields = formConfig[energySource]?.fields;
  if (energyFields) {
    const energyField = energyFields.find((field: { name: string }) => field.name === key);
    if (energyField) return energyField.label;
  }

  return key;
};

export default getFieldLabel;
