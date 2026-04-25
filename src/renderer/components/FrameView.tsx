import { css, SerializedStyles } from '@emotion/react';
import { Button } from '@mui/material';
import { useState } from 'react';
import { BinarySearchModal } from './BinarySearchModal';
import { FrameImage } from './FrameImage';
import { FrameNumberControl } from './FrameNumberControl';

export const FrameView = (props: {
  frameNumber: number;
  setFrameNumber: (frameNumber: number) => void;
  frameNumberMin: number;
  frameNumberMax: number;
  testId?: string;
  className?: string;
  css?: SerializedStyles;
}) => {
  const [openBinarySearchModal, setOpenBinarySearchModal] = useState(false);

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
          props.testId ? `${props.testId}-binary-search-open` : undefined
        }
        variant="outlined"
        onClick={() => {
          setOpenBinarySearchModal(true);
        }}
      >
        Binary Search
      </Button>
      <BinarySearchModal
        open={openBinarySearchModal}
        onClose={(value) => {
          setOpenBinarySearchModal(false);
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
