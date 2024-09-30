import React from 'react';
import { StyledChip, StyledCircularProgress } from './StyledComponents';

function StatusChip({ status }: { status: string }) {
  return (
    <StyledChip
      label={
        <>
          {status}
          {status === 'processing' && <StyledCircularProgress />}
        </>
      }
      status={status}
    />
  );
}

export default StatusChip;
