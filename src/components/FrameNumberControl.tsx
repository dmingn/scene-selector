/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button, ButtonGroup } from '@mui/material';
import { useContext } from 'react';
import { VideoContext } from '../contexts/VideoContext';
import { frameNumberToTimecode } from '../utils/frameNumberToTimecode';

const AddSubButton = (props: {
  frameNumber: number;
  setFrameNumber: (frameNumber: number) => void;
  diff: number;
  fps: number;
  type: 'frame' | 'second';
}) => {
  const value =
    (props.diff >= 0 ? '+' : '') +
    props.diff.toString() +
    (props.type === 'second' ? 's' : '');

  return (
    <Button
      variant="outlined"
      onClick={() => {
        props.setFrameNumber(
          props.frameNumber +
            (props.type === 'second' ? props.diff * props.fps : props.diff),
        );
      }}
      key={value}
    >
      {value}
    </Button>
  );
};

const AddSubButtonGroup = (props: {
  frameNumber: number;
  setFrameNumber: (frameNumber: number) => void;
  diffs: number[];
  fps: number;
  type: 'frame' | 'second';
}) => {
  return (
    <ButtonGroup css={css({ margin: '4px' })}>
      {props.diffs.map((diff) => (
        <AddSubButton
          frameNumber={props.frameNumber}
          setFrameNumber={props.setFrameNumber}
          diff={diff}
          fps={props.fps}
          type={props.type}
          key={diff}
        />
      ))}
    </ButtonGroup>
  );
};

export const FrameNumberControl = (props: {
  frameNumber: number;
  setFrameNumber: (frameNumber: number) => void;
}) => {
  const { fps } = useContext(VideoContext);

  return (
    <div>
      <div
        css={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <AddSubButtonGroup
          frameNumber={props.frameNumber}
          setFrameNumber={props.setFrameNumber}
          diffs={[-10, -5, -1]}
          fps={fps}
          type="frame"
        />
        <div>{props.frameNumber}</div>
        <AddSubButtonGroup
          frameNumber={props.frameNumber}
          setFrameNumber={props.setFrameNumber}
          diffs={[1, 5, 10]}
          fps={fps}
          type="frame"
        />
      </div>
      <div
        css={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <AddSubButtonGroup
          frameNumber={props.frameNumber}
          setFrameNumber={props.setFrameNumber}
          diffs={[-10, -5, -1]}
          fps={fps}
          type="second"
        />
        <div>{frameNumberToTimecode(props.frameNumber, fps)}</div>
        <AddSubButtonGroup
          frameNumber={props.frameNumber}
          setFrameNumber={props.setFrameNumber}
          diffs={[1, 5, 10]}
          fps={fps}
          type="second"
        />
      </div>
    </div>
  );
};
