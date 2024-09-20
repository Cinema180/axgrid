import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Button, Chip, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Subscription } from 'rxjs';
import { tradeService } from '../services/tradeService';
import { Trade } from '../types';
import TradeDetailDialog from './TradeDetailDialog';

// Define the flash animation for awaiting confirmation trades
const flash = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

// Styled Chip component with conditional animations based on status
const StatusChip = styled(Chip)(({ status }: { status: string }) => ({
  ...(status === 'awaiting confirmation' && {
    animation: `${flash} 1.5s ease-in-out infinite`, // Flashing effect for awaiting confirmation status
  }),
  color: '#fff', // Text color for all chips
  fontWeight: 'bold', // Bold text
  backgroundColor:
    status === 'completed'
      ? '#4caf50' // Green for completed
      : status === 'pending'
      ? '#2196f3' // Blue for pending
      : status === 'processing'
      ? '#ff9800' // Yellow for processing
      : status === 'cancelled'
      ? '#9e9e9e' // Gray for cancelled
      : status === 'rejected' || status === 'failed'
      ? '#f44336' // Red for rejected or failed
      : status === 'awaiting confirmation'
      ? '#ff5722' // Orange for awaiting confirmation
      : '#607d8b', // Default color for unknown statuses
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .even-row': {
    backgroundColor: '#f9f9f9', // Light gray for even rows
  },
  '& .odd-row': {
    backgroundColor: '#ffffff', // White for odd rows
  },
}));

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
    return (
      <StatusChip
        label={
          <>
            {status}
            {status === 'processing' && (
              <CircularProgress
                sx={{
                  color: 'white',
                  marginLeft: 0.5,
                  position: 'relative',
                  top: '1px',
                }}
                size={10}
                thickness={7}
              />
            )}{' '}
            {/* Swirly icon for processing */}
          </>
        }
        status={status}
      />
    );
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
        <StyledDataGrid
          rows={trades}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 20]}
          onRowClick={handleRowClick} // Open detail dialog on row click
          isRowSelectable={() => false}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
          }
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
