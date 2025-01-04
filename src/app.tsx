import { css } from '@emotion/react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ipcLink } from 'electron-trpc/renderer';
import { useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getVideoInfoInputSchema } from './apiSchema';
import { CommandExample } from './components/CommandExample';
import { FileInput } from './components/FileInput';
import { StartEndSelector } from './components/StartEndSelector';
import { VideoContext } from './contexts/VideoContext';
import { videoInfoInitialState, videoInfoReducer } from './states/videoInfo';
import { trpc } from './trpc';
import { clamp } from './utils/clamp';

const Content = () => {
  const [videoInfo, dispatchVideoInfo] = useReducer(
    videoInfoReducer,
    videoInfoInitialState,
  );

  const getVideoInfoInput = { videoPath: videoInfo.filePath };
  const { data: fetchedVideoInfo } = trpc.getVideoInfo.useQuery(
    getVideoInfoInput,
    { enabled: getVideoInfoInputSchema.safeParse(getVideoInfoInput).success },
  );

  useEffect(() => {
    if (fetchedVideoInfo) {
      dispatchVideoInfo({
        type: 'SET_INFO',
        fps: fetchedVideoInfo.fps,
        frameCount: fetchedVideoInfo.frameCount,
      });
    }
  }, [fetchedVideoInfo]);

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
    <VideoContext.Provider
      value={{
        filePath: videoInfo.filePath,
        fps: videoInfo.fps,
        frameCount: videoInfo.frameCount,
      }}
    >
      <div
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];

          if (file) {
            dispatchVideoInfo({
              type: 'SET_FILE_PATH',
              filePath: window.webUtils.getPathForFile(file),
            });
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
                dispatchVideoInfo({
                  type: 'SET_FILE_PATH',
                  filePath: window.webUtils.getPathForFile(file),
                });
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
    </VideoContext.Provider>
  );
};

export const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            cacheTime: Infinity,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [ipcLink()] }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Content />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
