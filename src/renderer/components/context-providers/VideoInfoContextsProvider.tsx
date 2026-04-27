import { createContext, ReactNode, useMemo, useState } from 'react';
import { getVideoInfoInputSchema } from '../../../rpcSchema';
import { trpc } from '../../trpc';

export type VideoInfoContextValue = {
  filePath: string | undefined;
  fps: number | undefined;
  frameCount: number | undefined;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string | undefined;
};

export const VideoInfoContext = createContext<VideoInfoContextValue>(null);

export const VideoInfoSetFilePathContext =
  createContext<(filePath: string) => void>(null);

export const VideoInfoResetContext = createContext<() => void>(null);

export const VideoInfoRefetchContext = createContext<() => void>(null);

export const VideoInfoContextsProvider = (props: { children: ReactNode }) => {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);

  const getVideoInfoInput = { videoPath: filePath };
  const {
    data: fetchedVideoInfo,
    isError: getVideoInfoIsError,
    error: getVideoInfoError,
    isFetching: getVideoInfoIsFetching,
    refetch: refetchVideoInfo,
  } = trpc.getVideoInfo.useQuery(getVideoInfoInput, {
    enabled: getVideoInfoInputSchema.safeParse(getVideoInfoInput).success,
  });

  const videoInfo = useMemo<VideoInfoContextValue>(
    () => ({
      filePath,
      fps: fetchedVideoInfo?.fps,
      frameCount: fetchedVideoInfo?.frameCount,
      isFetching: getVideoInfoIsFetching,
      isError: getVideoInfoIsError,
      errorMessage: getVideoInfoIsError
        ? getVideoInfoError?.message ?? 'Failed to load video info.'
        : undefined,
    }),
    [
      filePath,
      fetchedVideoInfo?.fps,
      fetchedVideoInfo?.frameCount,
      getVideoInfoIsFetching,
      getVideoInfoIsError,
      getVideoInfoError,
    ],
  );
  return (
    <VideoInfoContext.Provider value={videoInfo}>
      <VideoInfoResetContext.Provider
        value={() => {
          setFilePath(undefined);
        }}
      >
        <VideoInfoRefetchContext.Provider
          value={() => {
            refetchVideoInfo();
          }}
        >
          <VideoInfoSetFilePathContext.Provider
            value={(filePath: string) => {
              setFilePath(filePath);
            }}
          >
            {props.children}
          </VideoInfoSetFilePathContext.Provider>
        </VideoInfoRefetchContext.Provider>
      </VideoInfoResetContext.Provider>
    </VideoInfoContext.Provider>
  );
};
