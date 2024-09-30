import React from 'react';
import { styled, keyframes } from '@mui/system';
import {
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Shaded Header
export const StyledDialogTitle = styled(MuiDialogTitle)(() => ({
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
export const StyledDialogActions = styled(MuiDialogActions)(() => ({
  backgroundColor: '#f0f0f0',
  padding: '8px 16px',
}));

// Styled DataGrid
export const StyledDataGrid = styled(DataGrid)(() => ({
  '& .even-row': {
    backgroundColor: '#f9f9f9', // Light gray for even rows
  },
  '& .odd-row': {
    backgroundColor: '#ffffff', // White for odd rows
  },
}));

// Define the flash animation for awaiting confirmation trades
const statusChipflashAnimation = `${keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`} 1.5s ease-in-out infinite`;

// Define all the different status colours
const statusColours: { [key: string]: string } = {
  completed: '#4caf50', // Green for completed
  pending: '#2196f3', // Blue for pending
  processing: '#ff9800', // Yellow for processing
  cancelled: '#9e9e9e', // Gray for cancelled
  rejected: '#f44336', // Red for rejected
  failed: '#f44336', // Red for failed
  'awaiting confirmation': '#ff5722', // Orange for awaiting confirmation
};

// Styled Chip component with background color based on status
export const StyledChip = styled(Chip)(({ status }: { status: string }) => ({
  ...(status === 'awaiting confirmation' && {
    animation: statusChipflashAnimation,
  }),
  color: '#fff',
  fontWeight: 'bold',
  backgroundColor: statusColours[status] || '#607d8b', // Default color for unknown statuses
}));

// Styled CircularProgress component
export const StyledCircularProgress = styled((props) => (
  <CircularProgress {...props} size={10} thickness={7} />
))(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(0.5),
  position: 'relative',
  top: '1px',
}));
