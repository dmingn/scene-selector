import { css } from '@emotion/react';
import NavigationIcon from '@mui/icons-material/Navigation';
import { Slider, SliderThumb } from '@mui/material';
import { sliderClasses } from '@mui/material/Slider';
import { forwardRef, useContext, type ReactNode } from 'react';
import { frameNumberToTimecode } from '../../utils/frameNumberToTimecode';
import { FrameView } from './FrameView';
import {
  FrameNumbersContext,
  FrameNumbersDispatchContext,
} from './context-providers/FrameNumbersContextsProvider';
import { VideoInfoContext } from './context-providers/VideoInfoContextsProvider';

const RangeThumb = forwardRef<HTMLSpanElement, Record<string, unknown>>(
  (props, ref) => {
    const thumbProps = props as Record<string, unknown> & {
      children?: ReactNode;
      'data-index'?: number;
    };

    const dataIndex = Number(thumbProps['data-index']);
    const limit = dataIndex === 0 || dataIndex === 2 || dataIndex === 4;

    const { children, ...rest } = thumbProps;

    if (limit) {
      return (
        <SliderThumb
          {...rest}
          ref={ref}
          css={css({
            boxShadow: 'none',
            width: '30px',
            height: '30px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 0,
            // Keep MUI's centering transform and offset the marker from the rail.
            transform: 'translate(-50%, -50%) translateY(-14px)',
            '&::before': {
              display: 'none',
            },
            '&:hover': {
              boxShadow: 'none',
            },
            [`&.${sliderClasses.focusVisible}`]: {
              boxShadow: 'none',
            },
            [`&.${sliderClasses.active}`]: {
              boxShadow: 'none',
            },
          })}
        >
          {children}
          <NavigationIcon
            css={css({
              display: 'block',
              fontSize: 28,
              transform: 'scaleY(-1)',
            })}
          />
        </SliderThumb>
      );
    }

    return (
      <SliderThumb {...rest} ref={ref}>
        {children}
      </SliderThumb>
    );
  },
);

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

  const handleRangeChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    const points = Array.isArray(newValue)
      ? newValue
      : [
          frameNumbers.leftLimit,
          frameNumbers.start,
          frameNumbers.midLimit,
          frameNumbers.end,
          frameNumbers.rightLimit,
        ];

    switch (activeThumb) {
      case 0:
        dispatchFrameNumbers({ type: 'SET_LEFT_LIMIT', leftLimit: points[0] });
        return;
      case 1:
        dispatchFrameNumbers({ type: 'SET_START', start: points[1] });
        return;
      case 2:
        dispatchFrameNumbers({ type: 'SET_MID_LIMIT', midLimit: points[2] });
        return;
      case 3:
        dispatchFrameNumbers({ type: 'SET_END', end: points[3] });
        return;
      case 4:
        dispatchFrameNumbers({
          type: 'SET_RIGHT_LIMIT',
          rightLimit: points[4],
        });
        return;
      default:
        return;
    }
  };

  return (
    <div
      data-testid="e2e-start-end-selector"
      css={css({ display: 'flex', flexDirection: 'column', gap: '16px' })}
    >
      <div
        css={css({
          display: 'flex',
          justifyContent: 'space-between',
          gap: '8px',
        })}
      >
        <FrameView
          testId="e2e-frame-view-start"
          frameNumber={frameNumbers.start}
          setFrameNumber={setStart}
          frameNumberMin={frameNumbers.leftLimit}
          frameNumberMax={frameNumbers.midLimit}
          css={css({ flex: 1 })}
        />
        <FrameView
          testId="e2e-frame-view-end"
          frameNumber={frameNumbers.end}
          setFrameNumber={setEnd}
          frameNumberMin={frameNumbers.midLimit}
          frameNumberMax={frameNumbers.rightLimit}
          css={css({ flex: 1 })}
        />
      </div>
      <div css={css({ padding: '8px 16px 0px 16px' })}>
        <Slider
          data-testid="e2e-range-slider"
          value={[
            frameNumbers.leftLimit,
            frameNumbers.start,
            frameNumbers.midLimit,
            frameNumbers.end,
            frameNumbers.rightLimit,
          ]}
          onChange={handleRangeChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => frameNumberToTimecode(value, fps)}
          min={0}
          max={frameCount - 1}
          disableSwap
          slots={{ thumb: RangeThumb }}
        />
      </div>
    </div>
  );
};
