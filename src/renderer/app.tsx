import { css } from '@emotion/react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Alert, Button, CircularProgress, Tooltip } from '@mui/material';
import type { ChangeEvent, DragEvent } from 'react';
import { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { CommandExample } from './components/CommandExample';
import {
  FrameNumbersContext,
  FrameNumbersContextsProvider,
  FrameNumbersDispatchContext,
} from './components/context-providers/FrameNumbersContextsProvider';
import { TrpcContextsProvider } from './components/context-providers/TrpcContextsProvider';
import {
  VideoInfoContext,
  VideoInfoContextsProvider,
  VideoInfoRefetchContext,
  VideoInfoResetContext,
  VideoInfoSetFilePathContext,
} from './components/context-providers/VideoInfoContextsProvider';
import { FileInput } from './components/FileInput';
import { StartEndSelector } from './components/StartEndSelector';

const Content = () => {
  const videoInfo = useContext(VideoInfoContext);
  const setFilePath = useContext(VideoInfoSetFilePathContext);
  const resetVideoInfo = useContext(VideoInfoResetContext);
  const refetchVideoInfo = useContext(VideoInfoRefetchContext);

  const frameNumbers = useContext(FrameNumbersContext);
  const dispatchFrameNumbers = useContext(FrameNumbersDispatchContext);

  const resetFrameNumbers = () => {
    dispatchFrameNumbers({
      type: 'RESET',
      frameCount: videoInfo.frameCount ?? 0,
    });
  };

  const isReady =
    videoInfo.fps !== undefined && videoInfo.frameCount !== undefined;

  return (
    <div
      onDragOver={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
      }}
      onDrop={(event: DragEvent<HTMLDivElement>) => {
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
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];

            if (file) {
              setFilePath(window.webUtils.getPathForFile(file));
            }
          }}
          css={css({ flex: 1 })}
        />
        {isReady && (
          <Tooltip title="Reset">
            <Button variant="outlined" onClick={resetFrameNumbers}>
              <RestartAltIcon />
            </Button>
          </Tooltip>
        )}
      </div>
      {videoInfo.filePath !== undefined &&
        (videoInfo.isFetching ? (
          <CircularProgress data-testid="e2e-loading-indicator" />
        ) : videoInfo.isError ? (
          <Alert
            data-testid="e2e-video-info-error"
            severity="error"
            action={
              <div css={css({ display: 'flex', gap: '8px' })}>
                <Button
                  data-testid="e2e-video-info-retry"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    refetchVideoInfo();
                  }}
                >
                  Retry
                </Button>
                <Button
                  data-testid="e2e-video-info-reset"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    resetVideoInfo();
                  }}
                >
                  Reset
                </Button>
              </div>
            }
          >
            {videoInfo.errorMessage}
          </Alert>
        ) : isReady ? (
          <StartEndSelector />
        ) : null)}
      {videoInfo.filePath !== undefined && isReady && (
        <CommandExample
          startFrameNumber={frameNumbers.start}
          endFrameNumber={frameNumbers.end}
        />
      )}
    </div>
  );
};

export const App = () => {
  return (
    <TrpcContextsProvider>
      <VideoInfoContextsProvider>
        <FrameNumbersContextsProvider>
          <Content />
        </FrameNumbersContextsProvider>
      </VideoInfoContextsProvider>
    </TrpcContextsProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
