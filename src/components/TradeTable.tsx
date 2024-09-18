import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Box, Typography } from '@mui/material';
import { Subscription } from 'rxjs';
import { tradeService } from '../services/tradeService';
import { Trade } from '../types';

function TradeTable() {
  const [trades, setTrades] = useState<Trade[]>([]);
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

  const handleConfirmTrade = (tradeId: string) => {
    tradeService.confirmTrade(tradeId);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Trade ID', width: 150 },
    { field: 'energySource', headerName: 'Energy Source', width: 150 },
    { field: 'amount', headerName: 'Amount (kWh)', width: 150 },
    { field: 'status', headerName: 'Status', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const trade = params.row as Trade;
        return (
          trade.status === 'awaiting confirmation' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleConfirmTrade(trade.id)}
            >
              Trade
            </Button>
          )
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
          checkboxSelection={false}
        />
      </div>
    </Box>
  );
}

export default TradeTable;
