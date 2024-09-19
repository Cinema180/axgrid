import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { Trade } from '../types';
import formConfig from '../resources/formConfig.json';
import { EnergySource } from '../types';

interface TradeDetailDialogProps {
  trade: Trade | null;
  open: boolean;
  onClose: () => void;
}

function TradeDetailDialog(props: TradeDetailDialogProps) {
  const { trade, open, onClose } = props;

  if (!trade) return null;

  // Helper function to get the label for a given field key
  const getFieldLabel = (key: string, energySource: EnergySource): string => {
    const commonField = formConfig.commonFields.find(
      (field) => field.name === key
    );
    if (commonField) return commonField.label;

    const energyFields = formConfig[energySource]?.fields;
    if (energyFields) {
      const energyField = energyFields.find((field) => field.name === key);
      if (energyField) return energyField.label;
    }

    // Fallback to using the key if no label is found
    return key;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Trade Details (ID: {trade.id})</DialogTitle>
      <DialogContent>
        <List>
          {Object.entries(trade.offeringDetails).map(([key, value]) => {
            const label = getFieldLabel(
              key,
              trade.offeringDetails.energySource as EnergySource
            );
            return (
              <ListItem key={key}>
                <ListItemText primary={label} secondary={value.toString()} />
              </ListItem>
            );
          })}
        </List>
        <Button onClick={onClose} variant="contained" color="primary" fullWidth>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default TradeDetailDialog;
