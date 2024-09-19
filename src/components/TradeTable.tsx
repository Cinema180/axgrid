import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
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

  const handleConfirmTrade = (tradeId: string) => {
    tradeService.confirmTrade(tradeId);
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
    { field: 'status', headerName: 'Status', width: 200 },
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
            onClick={() => handleConfirmTrade(trade.id)}
          >
            Trade
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
        Trades
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={trades}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 20]}
          onRowClick={handleRowClick} // Open detail dialog on row click
          isRowSelectable={() => false} // Disable row selection
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
