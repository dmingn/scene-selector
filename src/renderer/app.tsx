import { css } from '@emotion/react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Button, CircularProgress, Tooltip } from '@mui/material';
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
  VideoInfoSetFilePathContext,
} from './components/context-providers/VideoInfoContextsProvider';
import { FileInput } from './components/FileInput';
import { StartEndSelector } from './components/StartEndSelector';

const Content = () => {
  const videoInfo = useContext(VideoInfoContext);
  const setFilePath = useContext(VideoInfoSetFilePathContext);

  const frameNumbers = useContext(FrameNumbersContext);
  const dispatchFrameNumbers = useContext(FrameNumbersDispatchContext);

  const resetFrameNumbers = () => {
    dispatchFrameNumbers({
      type: 'RESET',
      frameCount: videoInfo.frameCount ?? 0,
    });
  };

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
            <Button variant="outlined" onClick={resetFrameNumbers}>
              <RestartAltIcon />
            </Button>
          </Tooltip>
        )}
      </div>
      {videoInfo.state !== 'IDLE' &&
        (videoInfo.state === 'FETCHED' ? (
          <StartEndSelector />
        ) : (
          <CircularProgress />
        ))}
      {videoInfo.state !== 'IDLE' &&
        (videoInfo.state === 'FETCHED' ? (
          <CommandExample
            startFrameNumber={frameNumbers.start}
            endFrameNumber={frameNumbers.end}
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
