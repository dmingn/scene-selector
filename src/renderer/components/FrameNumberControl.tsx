import { css } from '@emotion/react';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { frameNumberToTimecode } from '../../utils/frameNumberToTimecode';
import { VideoInfoContext } from './context-providers/VideoInfoContextsProvider';

export const FrameNumberControl = (props: {
  frameNumber: number;
  setFrameNumber: (frameNumber: number) => void;
}) => {
  const { fps } = useContext(VideoInfoContext);

  return (
    <div
      css={css({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      })}
    >
      <Button
        variant="outlined"
        onClick={() => {
          props.setFrameNumber(props.frameNumber - 1);
        }}
      >
        -1
      </Button>
      <div
        css={css({
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          minWidth: 0,
        })}
      >
        <div data-testid="e2e-frame-number">{props.frameNumber}</div>
        <div data-testid="e2e-frame-timecode">
          {frameNumberToTimecode(props.frameNumber, fps)}
        </div>
      </div>
      <Button
        variant="outlined"
        onClick={() => {
          props.setFrameNumber(props.frameNumber + 1);
        }}
      >
        +1
      </Button>
    </div>
  );
};
