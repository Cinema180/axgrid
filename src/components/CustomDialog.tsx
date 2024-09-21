import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CustomDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

function CustomDialog({
  title,
  open,
  onClose,
  children,
  actions,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Shaded Header */}
      <DialogTitle
        sx={{
          backgroundColor: '#f0f0f0',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Main Content */}
      <DialogContent sx={{ padding: 2 }}>{children}</DialogContent>

      {/* Shaded Footer */}
      <DialogActions sx={{ backgroundColor: '#f0f0f0', padding: '8px 16px' }}>
        {actions || (
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            size="small"
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default CustomDialog;
