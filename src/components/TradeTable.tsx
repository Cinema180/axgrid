import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Subscription } from 'rxjs';
import { tradeService } from '../services/tradeService';
import { Trade } from '../types';
import TradeDetailDialog from './TradeDetailDialog';

function TradeTable() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  useEffect(() => {
    const subscription: Subscription = tradeService
      .getTrades()
      .subscribe((tradeList) => {
        setTrades(tradeList);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRowClick = (params: any) => {
    const trade = params.row as Trade;
    setSelectedTrade(trade); // Set the selected trade to show details
  };

  const handleConfirmTrade = (tradeId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent row click event when Confirm button is clicked
    }
    tradeService.confirmTrade(tradeId);
  };

  // Render the status as a colored chip based on the trade's status
  const renderStatusChip = (status: string) => {
    let color: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default';
    switch (status) {
      case 'completed':
        color = 'success'; // Green for completed trades
        break;
      case 'pending':
        color = 'info'; // Blue for pending trades
        break;
      case 'processing':
        color = 'warning'; // Yellow for trades in progress
        break;
      case 'cancelled':
        color = 'default'; // Gray for cancelled trades
        break;
      case 'rejected':
      case 'failed':
        color = 'error'; // Red for rejected or failed trades
        break;
      case 'awaiting confirmation':
        color = 'warning'; // Orange for awaiting confirmation
        break;
      default:
        color = 'default'; // Default color for unknown statuses
    }
    return <Chip label={status} color={color} />;
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Trade ID', width: 150 },
    {
      field: 'energySource',
      headerName: 'Energy Source',
      width: 150,
      renderCell: (params) => {
        const trade = params.row as Trade;
        return trade.offeringDetails?.energySource || '';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => {
        const trade = params.row as Trade;
        return renderStatusChip(trade.status);
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const trade = params.row as Trade;
        return trade.status === 'awaiting confirmation' ? (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => handleConfirmTrade(trade.id, event)} // Pass the event to prevent row click
          >
            Confirm Trade
          </Button>
        ) : (
          'None'
        );
      },
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Manage Trades
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={trades}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 20]}
          onRowClick={handleRowClick} // Open detail dialog on row click
          isRowSelectable={() => false} // Disable row selection, per your original code
        />
      </div>

      {/* Show the detail dialog when a trade is selected */}
      <TradeDetailDialog
        trade={selectedTrade}
        open={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />
    </Box>
  );
}

export default TradeTable;
