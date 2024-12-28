import { css, SerializedStyles } from '@emotion/react';
import { Button, Dialog } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { VideoContext } from '../contexts/VideoContext';
import { frameNumberToTimecode } from '../utils/frameNumberToTimecode';
import { FrameImage } from './FrameImage';

const FrameImageAndSelectButton = (props: {
  fps: number;
  frameNumber: number;
  onSelect: (value: number) => void;
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
          alignItems: 'center',
          gap: '4px',
        }),
        props.css,
      ]}
    >
      <FrameImage frameNumber={props.frameNumber} css={css({ flex: 1 })} />
      <div>{props.frameNumber}</div>
      <div>{frameNumberToTimecode(props.frameNumber, props.fps)}</div>
      <Button
        variant="outlined"
        onClick={() => {
          props.onSelect(props.frameNumber);
        }}
      >
        Select
      </Button>
    </div>
  );
};

export const BinarySearchModal = (props: {
  open: boolean;
  onClose: (value: number) => void;
  leftFrameNumber: number;
  rightFrameNumber: number;
}) => {
  const { fps } = useContext(VideoContext);

  const [leftFrameNumber, setLeftFrameNumber] = useState<number>(0);
  const [midFrameNumber, setMidFrameNumber] = useState<number>(0);
  const [rightFrameNumber, setRightFrameNumber] = useState<number>(0);

  useEffect(() => {
    setMidFrameNumber(Math.floor((leftFrameNumber + rightFrameNumber) / 2));
  }, [leftFrameNumber, rightFrameNumber]);

  useEffect(() => {
    if (props.open) {
      setLeftFrameNumber(props.leftFrameNumber);
      setRightFrameNumber(props.rightFrameNumber);
    }
  }, [props.open]);

  return (
    <Dialog open={props.open} fullWidth maxWidth="xl">
      <div
        css={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '16px',
        })}
      >
        <div
          css={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: '8px',
          })}
        >
          <FrameImageAndSelectButton
            fps={fps}
            frameNumber={leftFrameNumber}
            onSelect={props.onClose}
            css={css({ flex: 1 })}
          />
          <FrameImageAndSelectButton
            fps={fps}
            frameNumber={midFrameNumber}
            onSelect={props.onClose}
            css={css({ flex: 1 })}
          />

          <FrameImageAndSelectButton
            fps={fps}
            frameNumber={rightFrameNumber}
            onSelect={props.onClose}
            css={css({ flex: 1 })}
          />
        </div>
        <div
          css={css({
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            width: '60%',
          })}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setRightFrameNumber(midFrameNumber);
            }}
            css={css({ flex: 1 })}
          >
            L
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setLeftFrameNumber(midFrameNumber);
            }}
            css={css({ flex: 1 })}
          >
            R
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
