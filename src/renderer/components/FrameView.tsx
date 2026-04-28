import { css, SerializedStyles } from '@emotion/react';
import { Button } from '@mui/material';
import { useState } from 'react';
import { FrameImage } from './FrameImage';
import { FrameNumberControl } from './FrameNumberControl';
import { RangeNarrowingModal } from './RangeNarrowingModal';

export const FrameView = (props: {
  frameNumber: number;
  setFrameNumber: (frameNumber: number) => void;
  frameNumberMin: number;
  frameNumberMax: number;
  testId?: string;
  className?: string;
  css?: SerializedStyles;
}) => {
  const [openRangeNarrowingModal, setOpenRangeNarrowingModal] = useState(false);

  return (
    <div
      data-testid={props.testId}
      className={props.className}
      css={[
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }),
        props.css,
      ]}
    >
      <FrameImage frameNumber={props.frameNumber} css={css({ flex: 1 })} />
      <FrameNumberControl
        frameNumber={props.frameNumber}
        setFrameNumber={props.setFrameNumber}
      />
      <Button
        data-testid={
          props.testId ? `${props.testId}-range-narrowing-open` : undefined
        }
        variant="outlined"
        onClick={() => {
          setOpenRangeNarrowingModal(true);
        }}
      >
        Narrow Range
      </Button>
      <RangeNarrowingModal
        open={openRangeNarrowingModal}
        onClose={(value: number | null) => {
          setOpenRangeNarrowingModal(false);
          if (value !== null) {
            props.setFrameNumber(value);
          }
        }}
        leftFrameNumber={props.frameNumberMin}
        rightFrameNumber={props.frameNumberMax}
      />
    </div>
  );
};
