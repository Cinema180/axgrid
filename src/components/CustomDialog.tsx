import React from 'react';
import { Dialog, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  StyledDialogTitle,
  StyledDialogContent,
  StyledDialogActions,
} from './StyledComponents';

interface CustomDialogProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
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
      <StyledDialogTitle>
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <StyledDialogContent>{children}</StyledDialogContent>
      <StyledDialogActions>
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
      </StyledDialogActions>
    </Dialog>
  );
}

CustomDialog.defaultProps = {
  actions: null,
};

export default CustomDialog;
