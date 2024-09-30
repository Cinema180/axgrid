import React, { useEffect, useState } from 'react';
import { Typography, Divider, Grid, Box } from '@mui/material';
import { Subscription } from 'rxjs';
import formConfig from '../resources/formConfig.json';
import CustomDialog from './CustomDialog';
import StatusChip from './StatusChip';
import { tradeService } from '../services/tradeService';
import { Trade } from '../types/tradeTypes';
import getFieldLabel from './TradeDetailDialog.helpers';

interface TradeDetailDialogProps {
  onClose: () => void;
  open: boolean;
  trade: Trade | null;
}

function TradeDetailDialog(props: TradeDetailDialogProps) {
  const { trade: initialTrade, open, onClose } = props;
  const [trade, setTrade] = useState<Trade | null>(initialTrade);

  useEffect(() => {
    if (initialTrade) {
      const subscription: Subscription = tradeService
        .getTrades()
        .subscribe((updatedTrades) => {
          const updatedTrade = updatedTrades.find(
            (t) => t.id === initialTrade.id
          );
          if (updatedTrade) {
            setTrade(updatedTrade); // Update the trade details in real-time
          }
        });

      return () => subscription.unsubscribe();
    }
    return undefined;
  }, [initialTrade]);

  if (!trade) return null;

  const commonFields = formConfig.commonFields.filter((field) =>
    Object.keys(trade.offeringDetails).includes(field.name)
  );

  const dynamicFields = formConfig[
    trade.offeringDetails.energySource
  ]?.fields.filter((field) =>
    Object.keys(trade.offeringDetails).includes(field.name)
  );

  return (
    <CustomDialog title="Trade Details" open={open} onClose={onClose}>
      {/* General Information Section */}
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
          {commonFields.map((field) => (
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

      <Divider />

      {/* Energy Source-Specific Information */}
      <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Energy Source-Specific Information
        </Typography>
        <Grid container spacing={2}>
          {dynamicFields?.map((field) => (
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
    </CustomDialog>
  );
}

export default TradeDetailDialog;
