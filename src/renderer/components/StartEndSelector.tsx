import { css } from '@emotion/react';
import { Slider } from '@mui/material';
import { useContext } from 'react';
import { frameNumberToTimecode } from '../../utils/frameNumberToTimecode';
import { FrameView } from './FrameView';
import {
  FrameNumbersContext,
  FrameNumbersDispatchContext,
} from './context-providers/FrameNumbersContextsProvider';
import { VideoInfoContext } from './context-providers/VideoInfoContextsProvider';

export const StartEndSelector = () => {
  const { frameCount, fps } = useContext(VideoInfoContext);

  const frameNumbers = useContext(FrameNumbersContext);
  const dispatchFrameNumbers = useContext(FrameNumbersDispatchContext);

  const setStart = (start: number) => {
    dispatchFrameNumbers({ type: 'SET_START', start });
  };
  const setEnd = (end: number) => {
    dispatchFrameNumbers({ type: 'SET_END', end });
  };

  const handleRangeChange = (event: Event, newValue: number[]) => {
    const [start, end] = newValue;
    setStart(start);
    setEnd(end);
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
          frameNumber={frameNumbers.start}
          setFrameNumber={setStart}
          frameNumberMin={0}
          frameNumberMax={frameNumbers.end}
          css={css({ flex: 1 })}
        />
        <FrameView
          frameNumber={frameNumbers.end}
          setFrameNumber={setEnd}
          frameNumberMin={frameNumbers.start}
          frameNumberMax={frameCount - 1}
          css={css({ flex: 1 })}
        />
      </div>
      <div css={css({ padding: '0px 16px' })}>
        <Slider
          value={[frameNumbers.start, frameNumbers.end]}
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
