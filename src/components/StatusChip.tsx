import React from 'react';
import { Chip, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Define the flash animation for awaiting confirmation trades
const flash = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

// Styled Chip component with background color based on status
const StyledChip = styled(Chip)(({ status }: { status: string }) => ({
  ...(status === 'awaiting confirmation' && {
    animation: `${flash} 1.5s ease-in-out infinite`, // Flashing effect for awaiting confirmation status
  }),
  color: '#fff',
  fontWeight: 'bold',
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

interface StatusChipProps {
  status: string;
}

function StatusChip({ status }: { status: string }) {
  return (
    <StyledChip
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
          )}
        </>
      }
      status={status}
    />
  );
}

export default StatusChip;
