/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FrameImage } from './FrameImage';
import { FrameNumberControl } from './FrameNumberControl';

export const FrameView = (props: {
  filePath: string;
  fps: number;
  frameNumber: number;
  setFrameNumber: (frameNumber: number) => void;
}) => {
  return (
    <div
      css={css({
        display: 'flex',
        flexDirection: 'column',
        margin: '8px',
        maxWidth: '50%',
        width: '100%',
      })}
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
