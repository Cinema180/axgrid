import { CircularProgress } from '@mui/material';
import { StyledChip } from './StyledComponents';

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
