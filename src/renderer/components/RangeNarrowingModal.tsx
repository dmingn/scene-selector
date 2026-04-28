import { css, SerializedStyles } from '@emotion/react';
import { Button, Dialog } from '@mui/material';
import { useContext, useEffect, useReducer } from 'react';
import { frameNumberToTimecode } from '../../utils/frameNumberToTimecode';
import {
  RangeNarrowingAction,
  rangeNarrowingInitialState,
  rangeNarrowingReducer,
  RangeNarrowingState,
} from '../states/rangeNarrowingState';
import { FrameImage } from './FrameImage';
import { VideoInfoContext } from './context-providers/VideoInfoContextsProvider';

const FrameImageAndActionButton = (props: {
  fps: number;
  frameNumber: number;
  buttonLabel: string;
  onClick: () => void;
  testId?: string;
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
        data-testid={props.testId}
        variant="outlined"
        onClick={props.onClick}
      >
        {props.buttonLabel}
      </Button>
    </div>
  );
};

const FrameImageAndActionButtons = (props: {
  fps: number;
  frameNumbers: number[];
  buttonLabel: string;
  onClick: (frameNumber: number, index: number) => void;
  testIdPrefix?: string;
}) => {
  return (
    <div
      css={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: '8px',
      })}
    >
      {props.frameNumbers.map((frameNumber, index) => (
        <FrameImageAndActionButton
          key={index}
          fps={props.fps}
          frameNumber={frameNumber}
          buttonLabel={props.buttonLabel}
          onClick={() => {
            props.onClick(frameNumber, index);
          }}
          testId={
            props.testIdPrefix ? `${props.testIdPrefix}-select-${index}` : undefined
          }
          css={css({ flex: 1 })}
        />
      ))}
    </div>
  );
};

const CandidateNarrowingControl = (props: {
  rangeNarrowingState: RangeNarrowingState;
  dispatchRangeNarrowing: (action: RangeNarrowingAction) => void;
  fps: number;
}) => {
  return (
    <div
      css={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      })}
    >
      <FrameImageAndActionButtons
        fps={props.fps}
        frameNumbers={props.rangeNarrowingState.candidates}
        buttonLabel="Zoom in"
        onClick={(_value: number, index: number) => {
          props.dispatchRangeNarrowing({ type: 'ZOOM_IN', index });
        }}
        testIdPrefix="e2e-range-narrowing"
      />
    </div>
  );
};

export const RangeNarrowingModal = (props: {
  open: boolean;
  onClose: (value: number | null) => void;
  leftFrameNumber: number;
  rightFrameNumber: number;
}) => {
  const { fps } = useContext(VideoInfoContext);

  const [rangeNarrowingState, dispatchRangeNarrowing] = useReducer(
    rangeNarrowingReducer,
    rangeNarrowingInitialState,
  );

  useEffect(() => {
    if (props.open) {
      dispatchRangeNarrowing({
        type: 'RESET',
        left: props.leftFrameNumber,
        right: props.rightFrameNumber,
      });
    }
  }, [props.open]);

  return (
    <Dialog
      data-testid="e2e-range-narrowing-modal"
      open={props.open}
      onClose={() => {
        props.onClose(null);
      }}
      fullWidth
      maxWidth="xl"
    >
      <div
        data-testid="e2e-range-narrowing-modal-body"
        css={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '16px',
        })}
      >
        {rangeNarrowingState.right - rangeNarrowingState.left < 10 ? (
          <FrameImageAndActionButtons
            fps={fps}
            frameNumbers={[
              ...Array(
                rangeNarrowingState.right - rangeNarrowingState.left + 1,
              ).keys(),
            ].map((i) => i + rangeNarrowingState.left)}
            buttonLabel="Select"
            onClick={(frameNumber: number) => {
              props.onClose(frameNumber);
            }}
            testIdPrefix="e2e-range-narrowing"
          />
        ) : (
          <CandidateNarrowingControl
            rangeNarrowingState={rangeNarrowingState}
            dispatchRangeNarrowing={dispatchRangeNarrowing}
            fps={fps}
          />
        )}
        <div
          css={css({
            display: 'flex',
            width: '60%',
          })}
        >
          <Button
            data-testid="e2e-range-narrowing-undo"
            variant="outlined"
            onClick={() => {
              dispatchRangeNarrowing({ type: 'UNDO' });
            }}
            disabled={!rangeNarrowingState.undoable}
            css={css({ flex: 1 })}
          >
            Undo
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
