import { css, SerializedStyles } from '@emotion/react';
import { Button, Dialog } from '@mui/material';
import { useContext, useEffect, useReducer } from 'react';
import { frameNumberToTimecode } from '../../utils/frameNumberToTimecode';
import {
  binarySearchInitialState,
  binarySearchReducer,
} from '../states/binarySearchState';
import { FrameImage } from './FrameImage';
import { VideoInfoContext } from './context-providers/VideoInfoContextsProvider';

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
  onClose: (value: number | null) => void;
  leftFrameNumber: number;
  rightFrameNumber: number;
}) => {
  const { fps } = useContext(VideoInfoContext);

  const [binarySearchState, dispatchBinarySearch] = useReducer(
    binarySearchReducer,
    binarySearchInitialState,
  );

  useEffect(() => {
    if (props.open) {
      dispatchBinarySearch({
        type: 'RESET',
        left: props.leftFrameNumber,
        right: props.rightFrameNumber,
      });
    }
  }, [props.open]);

  return (
    <Dialog
      open={props.open}
      onClose={() => {
        props.onClose(null);
      }}
      fullWidth
      maxWidth="xl"
    >
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
            frameNumber={binarySearchState.left}
            onSelect={props.onClose}
            css={css({ flex: 1 })}
          />
          <FrameImageAndSelectButton
            fps={fps}
            frameNumber={binarySearchState.mid}
            onSelect={props.onClose}
            css={css({ flex: 1 })}
          />

          <FrameImageAndSelectButton
            fps={fps}
            frameNumber={binarySearchState.right}
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
              dispatchBinarySearch({ type: 'BISECT_LEFT' });
            }}
            css={css({ flex: 1 })}
          >
            L
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              dispatchBinarySearch({ type: 'BISECT_RIGHT' });
            }}
            css={css({ flex: 1 })}
          >
            R
          </Button>
        </div>
        <div
          css={css({
            display: 'flex',
            width: '60%',
          })}
        >
          <Button
            variant="outlined"
            onClick={() => {
              dispatchBinarySearch({ type: 'UNDO' });
            }}
            disabled={!binarySearchState.undoable}
            css={css({ flex: 1 })}
          >
            Undo
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
