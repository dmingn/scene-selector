/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from '@emotion/react';
import { FrameImage } from './FrameImage';
import { FrameNumberControl } from './FrameNumberControl';

export const FrameView = (props: {
  frameNumber: number;
  setFrameNumber: (frameNumber: number) => void;
  className?: string;
  css?: SerializedStyles;
}) => {
  return (
    <div
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
      <FrameImage frameNumber={props.frameNumber} />
      <FrameNumberControl
        frameNumber={props.frameNumber}
        setFrameNumber={props.setFrameNumber}
      />
    </div>
  );
};
