import { css } from '@emotion/react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CommandExample } from './components/CommandExample';
import { FileInput } from './components/FileInput';
import { StartEndSelector } from './components/StartEndSelector';
import { TrpcContextsProvider } from './components/TrpcContextsProvider';
import {
  VideoInfoContext,
  VideoInfoContextsProvider,
  VideoInfoSetFilePathContext,
} from './components/VideoInfoContextsProvider';
import { clamp } from './utils/clamp';

const Content = () => {
  const videoInfo = useContext(VideoInfoContext);
  const setFilePath = useContext(VideoInfoSetFilePathContext);

  const [startFrameNumber, _setStartFrameNumber] = useState<number>(0);
  const [endFrameNumber, _setEndFrameNumber] = useState<number>(0);

  const setStartFrameNumber = (newValue: number) => {
    _setStartFrameNumber(clamp(newValue, 0, endFrameNumber));
  };
  const setEndFrameNumber = (newValue: number) => {
    _setEndFrameNumber(
      clamp(
        newValue,
        startFrameNumber,
        videoInfo.frameCount ? videoInfo.frameCount - 1 : 0,
      ),
    );
  };

  const resetStartEnd = () => {
    setStartFrameNumber(0);
    setEndFrameNumber(videoInfo.frameCount ? videoInfo.frameCount - 1 : 0);
  };

  useEffect(() => {
    resetStartEnd();
  }, [videoInfo.frameCount]);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];

        if (file) {
          setFilePath(window.webUtils.getPathForFile(file));
        }
      }}
      css={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: videoInfo.filePath ? 'space-between' : 'center',
        gap: '16px',
        height: '100%',
      })}
    >
      <div css={css({ display: 'flex', gap: '8px' })}>
        <FileInput
          value={videoInfo.filePath}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              setFilePath(window.webUtils.getPathForFile(file));
            }
          }}
          css={css({ flex: 1 })}
        />
        {videoInfo.state === 'FETCHED' && (
          <Tooltip title="Reset">
            <Button variant="outlined" onClick={resetStartEnd}>
              <RestartAltIcon />
            </Button>
          </Tooltip>
        )}
      </div>
      {videoInfo.state !== 'IDLE' &&
        (videoInfo.state === 'FETCHED' ? (
          <StartEndSelector
            startFrameNumber={startFrameNumber}
            setStartFrameNumber={setStartFrameNumber}
            endFrameNumber={endFrameNumber}
            setEndFrameNumber={setEndFrameNumber}
          />
        ) : (
          <CircularProgress />
        ))}
      {videoInfo.state !== 'IDLE' &&
        (videoInfo.state === 'FETCHED' ? (
          <CommandExample
            startFrameNumber={startFrameNumber}
            endFrameNumber={endFrameNumber}
          />
        ) : (
          <></>
        ))}
    </div>
  );
};

export const App = () => {
  return (
    <TrpcContextsProvider>
      <VideoInfoContextsProvider>
        <Content />
      </VideoInfoContextsProvider>
    </TrpcContextsProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
