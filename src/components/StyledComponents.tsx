import { styled } from '@mui/system';
import {
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
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
