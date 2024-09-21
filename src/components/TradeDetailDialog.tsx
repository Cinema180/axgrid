import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Trade } from '../types/types';
import formConfig from '../resources/formConfig.json';
import { EnergySource } from '../types/types';

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

  // Order and filter common fields as per formConfig.commonFields
  const commonFields = formConfig.commonFields.filter((field) =>
    Object.keys(trade.offeringDetails).includes(field.name)
  );

  const dynamicFields = formConfig[
    trade.offeringDetails.energySource as EnergySource
  ]?.fields.filter((field) =>
    Object.keys(trade.offeringDetails).includes(field.name)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Dialog Title with Close Button */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
        <Typography variant="h6" component="div">
          Trade Details
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          General Information
        </Typography>

        {/* Render Common Fields in the order defined by formConfig.commonFields */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' },
            gap: 0.1,
            alignItems: 'start', // Ensure alignment at the top for both columns
          }}
        >
          <ListItem sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <ListItemText primary="Trade ID" secondary={trade.id} />
          </ListItem>
          <ListItem sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
            <ListItemText primary="Status" secondary={trade.status} />
          </ListItem>
          {commonFields.map((field) => (
            <ListItem
              key={field.name}
              sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
            >
              <ListItemText
                primary={getFieldLabel(
                  field.name,
                  trade.offeringDetails.energySource as EnergySource
                )}
                secondary={trade.offeringDetails[field.name]?.toString()}
                sx={{ whiteSpace: 'pre-wrap' }} // Ensures that overflow text wraps correctly
              />
            </ListItem>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Energy Source-Specific Information
        </Typography>

        {/* Render Source-Specific Fields */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' },
            gap: 0.1,
            alignItems: 'start', // Ensure alignment at the top for both columns
          }}
        >
          {dynamicFields?.map((field) => (
            <ListItem
              key={field.name}
              sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
            >
              <ListItemText
                primary={getFieldLabel(
                  field.name,
                  trade.offeringDetails.energySource as EnergySource
                )}
                secondary={trade.offeringDetails[field.name]?.toString()}
                sx={{ whiteSpace: 'pre-wrap' }} // Ensures that overflow text wraps correctly
              />
            </ListItem>
          ))}
        </Box>

        {/* Close Button */}
        <Box mt={1} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default TradeDetailDialog;
