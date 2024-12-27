/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CircularProgress } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ipcLink } from 'electron-trpc/renderer';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CommandExample } from './components/CommandExample';
import { FileInput } from './components/FileInput';
import { StartEndSelector } from './components/StartEndSelector';
import { trpc } from './trpc';

const Content = () => {
  const [filePath, setFilePath] = useState<string | null>(null);

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setFilePath(window.webUtils.getPathForFile(file));
    }
  }

  const [frameCount, setFrameCount] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);

  const { data: videoInfo } = trpc.getVideoInfo.useQuery({
    path: filePath,
  });

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

  return (
    <div
      css={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: filePath ? 'space-between' : 'center',
        gap: '16px',
        height: '100%',
      })}
    >
      <FileInput value={filePath} onChange={handleOnChange} />
      {filePath &&
        (videoInfo ? (
          <StartEndSelector
            filePath={filePath}
            fps={fps}
            frameCount={frameCount}
            startFrameNumber={startFrameNumber}
            setStartFrameNumber={setStartFrameNumber}
            endFrameNumber={endFrameNumber}
            setEndFrameNumber={setEndFrameNumber}
          />
        ) : (
          <CircularProgress />
        ))}
      {filePath &&
        (videoInfo ? (
          <CommandExample
            filePath={filePath}
            fps={fps}
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
