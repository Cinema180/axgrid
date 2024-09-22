import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Subscription } from 'rxjs';
import { tradeService } from '../services/tradeService';
import { Trade } from '../types/types';
import TradeDetailDialog from './TradeDetailDialog';
import StatusChip from './StatusChip';
import { capitalise } from '../utilities/stringFormatter';
import CustomDialog from './CustomDialog';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .even-row': {
    backgroundColor: '#f9f9f9', // Light gray for even rows
  },
  '& .odd-row': {
    backgroundColor: '#ffffff', // White for odd rows
  },
}));

function TradeManager() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // For confirmation dialog
  const [tradeToConfirm, setTradeToConfirm] = useState<Trade | null>(null); // The trade to confirm
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

  const handleViewDetails = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleConfirmTradeClick = (trade: Trade) => {
    setTradeToConfirm(trade); // Set the trade to be confirmed
    setConfirmDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmTrade = (tradeId: string) => {
    tradeService.confirmTrade(tradeId);
    setConfirmDialogOpen(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Trade ID', width: 150 },
    {
      field: 'energySource',
      headerName: 'Energy Source',
      width: 150,
      valueGetter: (value, trade) => {
        return capitalise(trade.offeringDetails.energySource);
      },
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

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Manage Trades
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <StyledDataGrid
          rows={trades}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 20]}
          isRowSelectable={() => false}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
          }
        />
      </div>

      {/* Show the detail dialog when a VIEW DETAILS button is clicked */}
      <TradeDetailDialog
        trade={selectedTrade}
        open={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />
      {/* Show a confirmation dialog when a TRADE button is clicked */}
      <CustomDialog
        title="Confirm Trade"
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        actions={
          <>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => handleConfirmTrade(tradeToConfirm?.id as string)}
              variant="contained"
              color="primary"
            >
              OK
            </Button>
          </>
        }
      >
        <Typography>Are you sure you want to confirm this trade?</Typography>
      </CustomDialog>
    </Box>
  );
}

export default TradeManager;
