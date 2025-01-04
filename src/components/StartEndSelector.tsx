import { css } from '@emotion/react';
import { Slider } from '@mui/material';
import { useContext } from 'react';
import { VideoInfoContext } from '../states/videoInfo';
import { frameNumberToTimecode } from '../utils/frameNumberToTimecode';
import { FrameView } from './FrameView';

export const StartEndSelector = (props: {
  startFrameNumber: number;
  setStartFrameNumber: (newValue: number) => void;
  endFrameNumber: number;
  setEndFrameNumber: (newValue: number) => void;
}) => {
  const { frameCount, fps } = useContext(VideoInfoContext);

  const handleRangeChange = (event: Event, newValue: number[]) => {
    props.setStartFrameNumber(newValue[0]);
    props.setEndFrameNumber(newValue[1]);
  };

  return (
    <div css={css({ display: 'flex', flexDirection: 'column', gap: '8px' })}>
      <div
        css={css({
          display: 'flex',
          justifyContent: 'space-between',
          gap: '8px',
        })}
      >
        <FrameView
          frameNumber={props.startFrameNumber}
          setFrameNumber={props.setStartFrameNumber}
          frameNumberMin={0}
          frameNumberMax={props.endFrameNumber}
          css={css({ flex: 1 })}
        />
        <FrameView
          frameNumber={props.endFrameNumber}
          setFrameNumber={props.setEndFrameNumber}
          frameNumberMin={props.startFrameNumber}
          frameNumberMax={frameCount - 1}
          css={css({ flex: 1 })}
        />
      </div>
      <div css={css({ padding: '0px 16px' })}>
        <Slider
          value={[props.startFrameNumber, props.endFrameNumber]}
          onChange={handleRangeChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => frameNumberToTimecode(value, fps)}
          min={0}
          max={frameCount - 1}
          disableSwap
        />
      </div>
    </div>
  );
};
