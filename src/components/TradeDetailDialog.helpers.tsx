import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { EnergySource } from '../types/commonTypes';
import { OfferingDetails, Trade } from '../types/tradeTypes';
import formConfig from '../resources/formConfig.json';
import StatusChip from './StatusChip';

const getFieldLabel = (
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
    const energyField = energyFields.find(
      (field: { name: string }) => field.name === key
    );
    if (energyField) return energyField.label;
  }

  return key;
};

interface InformationSectionProps {
  fields: { name: string }[];
  trade: Trade;
}

function GeneralInformationSection({ trade, fields }: InformationSectionProps) {
  return (
    <Box sx={{ mt: -1, p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        General Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">Trade ID</Typography>
          <Typography variant="body1">{trade.id}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">Status</Typography>
          <StatusChip status={trade.status} />
        </Grid>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            <Typography variant="body2">
              {getFieldLabel(
                field.name,
                trade.offeringDetails.energySource,
                trade.offeringDetails
              )}
            </Typography>
            <Typography variant="body1">
              {trade.offeringDetails[field.name]?.toString()}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function EnergySourceSpecificInformationSection({
  trade,
  fields,
}: InformationSectionProps) {
  return (
    <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Energy Source-Specific Information
      </Typography>
      <Grid container spacing={2}>
        {fields?.map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            <Typography variant="body2">
              {getFieldLabel(
                field.name,
                trade.offeringDetails.energySource,
                trade.offeringDetails
              )}
            </Typography>
            <Typography variant="body1">
              {trade.offeringDetails[field.name]?.toString()}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default getFieldLabel;
export { GeneralInformationSection, EnergySourceSpecificInformationSection };
