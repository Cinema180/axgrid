import { styled, keyframes } from '@mui/system';
import {
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Shaded Header
export const StyledDialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  backgroundColor: '#f0f0f0',
  padding: '8px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

// Main Content
export const StyledDialogContent = styled(MuiDialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Shaded Footer
export const StyledDialogActions = styled(MuiDialogActions)(({ theme }) => ({
  backgroundColor: '#f0f0f0',
  padding: '8px 16px',
}));

// Styled DataGrid
export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .even-row': {
    backgroundColor: '#f9f9f9', // Light gray for even rows
  },
  '& .odd-row': {
    backgroundColor: '#ffffff', // White for odd rows
  },
}));

// The flashing animation for the 'awaiting confirmation' status StyledChip
const flash = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

// Styled Chip component with background color based on status
export const StyledChip = styled(Chip)(({ status }: { status: string }) => ({
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
