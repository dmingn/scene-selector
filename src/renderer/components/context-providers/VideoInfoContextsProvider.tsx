import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { getVideoInfoInputSchema } from '../../../rpcSchema';
import {
  VideoInfo,
  videoInfoInitialState,
  videoInfoReducer,
} from '../../states/videoInfo';
import { trpc } from '../../trpc';

export const VideoInfoContext = createContext<VideoInfo>(null);

export const VideoInfoSetFilePathContext =
  createContext<(filePath: string) => void>(null);

export const VideoInfoResetContext = createContext<() => void>(null);

export const VideoInfoRefetchContext = createContext<() => void>(null);

export const VideoInfoContextsProvider = (props: { children: ReactNode }) => {
  const [videoInfo, dispatchVideoInfo] = useReducer(
    videoInfoReducer,
    videoInfoInitialState,
  );

  const getVideoInfoInput = { videoPath: videoInfo.filePath };
  const {
    data: fetchedVideoInfo,
    isError: getVideoInfoIsError,
    error: getVideoInfoError,
    refetch: refetchVideoInfo,
  } = trpc.getVideoInfo.useQuery(getVideoInfoInput, {
    enabled: getVideoInfoInputSchema.safeParse(getVideoInfoInput).success,
  });

  useEffect(() => {
    if (fetchedVideoInfo) {
      dispatchVideoInfo({
        type: 'SET_INFO',
        fps: fetchedVideoInfo.fps,
        frameCount: fetchedVideoInfo.frameCount,
      });
    }
  }, [fetchedVideoInfo]);

  useEffect(() => {
    if (getVideoInfoIsError) {
      dispatchVideoInfo({
        type: 'SET_ERROR',
        errorMessage: getVideoInfoError?.message ?? 'Failed to load video info.',
      });
    }
  }, [getVideoInfoIsError, getVideoInfoError]);
  return (
    <VideoInfoContext.Provider value={videoInfo}>
      <VideoInfoResetContext.Provider
        value={() => {
          dispatchVideoInfo({ type: 'RESET' });
        }}
      >
        <VideoInfoRefetchContext.Provider
          value={() => {
            refetchVideoInfo();
          }}
        >
          <VideoInfoSetFilePathContext.Provider
            value={(filePath: string) => {
              dispatchVideoInfo({ type: 'SET_FILE_PATH', filePath });
            }}
          >
            {props.children}
          </VideoInfoSetFilePathContext.Provider>
        </VideoInfoRefetchContext.Provider>
      </VideoInfoResetContext.Provider>
    </VideoInfoContext.Provider>
  );
};
