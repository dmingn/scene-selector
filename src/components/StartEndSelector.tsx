/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CircularProgress, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { CommandExample } from './CommandExample';
import { FrameView } from './FrameView';

export const StartEndSelector = (props: { filePath: string }) => {
  const { data: videoInfo } = trpc.getVideoInfo.useQuery({
    path: props.filePath,
  });

  const [frameCount, setFrameCount] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);

  useEffect(() => {
    if (videoInfo) {
      setFrameCount(videoInfo.frameCount);
      setFps(videoInfo.fps);
    }
  }, [videoInfo]);

  const [startFrameNumber, _setStartFrameNumber] = useState<number>(0);
  const setStartFrameNumber = (newValue: number) => {
    _setStartFrameNumber(Math.max(0, Math.min(endFrameNumber, newValue)));
  };

  const [endFrameNumber, _setEndFrameNumber] = useState<number>(0);
  const setEndFrameNumber = (newValue: number) => {
    _setEndFrameNumber(
      Math.max(startFrameNumber, Math.min(frameCount - 1, newValue)),
    );
  };

  useEffect(() => {
    if (frameCount) {
      setEndFrameNumber(frameCount);
    }
  }, [frameCount]);

  const handleRangeChange = (event: Event, newValue: number[]) => {
    setStartFrameNumber(newValue[0]);
    setEndFrameNumber(newValue[1]);
  };

  return (
    <div css={css({ display: 'flex', justifyContent: 'center' })}>
      {videoInfo ? (
        <div
          css={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          })}
        >
          <div
            css={css({
              display: 'flex',
              justifyContent: 'space-between',
            })}
          >
            <FrameView
              filePath={props.filePath}
              fps={fps}
              frameNumber={startFrameNumber}
              setFrameNumber={setStartFrameNumber}
            />
            <FrameView
              filePath={props.filePath}
              fps={fps}
              frameNumber={endFrameNumber}
              setFrameNumber={setEndFrameNumber}
            />
          </div>
          <div
            css={css({
              padding: '0px 24px',
              width: '100%',
            })}
          >
            <Slider
              value={[startFrameNumber, endFrameNumber]}
              onChange={handleRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={frameCount - 1}
            />
          </div>
          <div
            css={css({
              padding: '24px 0px',
              width: '100%',
            })}
          >
            <CommandExample
              filePath={props.filePath}
              fps={fps}
              startFrameNumber={startFrameNumber}
              endFrameNumber={endFrameNumber}
            />
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};
