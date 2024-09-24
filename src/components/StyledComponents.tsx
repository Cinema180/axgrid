import { styled } from '@mui/system';
import {
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
} from '@mui/material';

// Shaded Dialog Header
export const StyledDialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  backgroundColor: '#f0f0f0',
  padding: '8px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

// Dialog Content
export const StyledDialogContent = styled(MuiDialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Shaded Dialog Footer
export const StyledDialogActions = styled(MuiDialogActions)(({ theme }) => ({
  backgroundColor: '#f0f0f0',
  padding: '8px 16px',
}));
