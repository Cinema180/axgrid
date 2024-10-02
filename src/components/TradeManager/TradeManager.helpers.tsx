import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Tooltip } from '@mui/material';
import { Trade } from '../../types/tradeTypes';
import StatusChip from '../StatusChip';

interface ColumnsProps {
  capitalise: (str: string) => string;
  handleConfirmTradeClick: (trade: Trade) => void;
  handleViewDetails: (trade: Trade) => void;
}

export default function getColumns({
  handleViewDetails,
  handleConfirmTradeClick,
  capitalise,
}: ColumnsProps): GridColDef[] {
  return [
    { field: 'id', headerName: 'Trade ID', width: 150 },
    {
      field: 'energySource',
      headerName: 'Energy Source',
      width: 150,
      valueGetter: (value, trade: Trade) =>
        capitalise(trade.offeringDetails.energySource),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => {
        const trade = params.row as Trade;
        return <StatusChip status={trade.status} />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const trade = params.row as Trade;
        return (
          <Box display="flex" gap={1} alignItems="center" height="100%">
            <Tooltip title="View this trade's details">
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => handleViewDetails(trade)}
              >
                View Details
              </Button>
            </Tooltip>
            {trade.status === 'awaiting confirmation' && (
              <Tooltip title="Confirm this trade">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleConfirmTradeClick(trade)}
                >
                  Trade
                </Button>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];
}
