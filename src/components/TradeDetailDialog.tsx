import React, { useEffect, useState } from 'react';
import { Divider } from '@mui/material';
import { Subscription } from 'rxjs';
import formConfig from '../resources/formConfig.json';
import CustomDialog from './CustomDialog';
import { tradeService } from '../services/tradeService';
import { Trade } from '../types/tradeTypes';
import {
  EnergySourceSpecificInformationSection,
  GeneralInformationSection,
} from './TradeDetailDialog.helpers';

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
      <GeneralInformationSection trade={trade} fields={commonFields} />
      <Divider />
      <EnergySourceSpecificInformationSection
        trade={trade}
        fields={dynamicFields}
      />
    </CustomDialog>
  );
}

export default TradeDetailDialog;
