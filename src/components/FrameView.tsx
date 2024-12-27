/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from '@emotion/react';
import { FrameImage } from './FrameImage';
import { FrameNumberControl } from './FrameNumberControl';

export const FrameView = (props: {
  filePath: string;
  fps: number;
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
      <FrameImage
        filePath={props.filePath}
        fps={props.fps}
        frameNumber={props.frameNumber}
      />
      <FrameNumberControl
        fps={props.fps}
        frameNumber={props.frameNumber}
        setFrameNumber={props.setFrameNumber}
      />
    </div>
  );
};
