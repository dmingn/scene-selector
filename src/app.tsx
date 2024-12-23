/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ipcLink } from 'electron-trpc/renderer';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FileInput } from './components/FileInput';
import { StartEndSelector } from './components/StartEndSelector';
import { trpc } from './trpc';

const Content = () => {
  const [filePath, setFilePath] = useState<string | null>('avsynctest.mp4');

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setFilePath(window.webUtils.getPathForFile(file));
    }
  }

  return (
    <div css={css({ display: 'flex', flexDirection: 'column' })}>
      <FileInput value={filePath} onChange={handleOnChange} />
      {filePath && <StartEndSelector filePath={filePath} />}
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
