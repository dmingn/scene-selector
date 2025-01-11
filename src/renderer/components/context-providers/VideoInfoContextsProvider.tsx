import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { getVideoInfoInputSchema } from '../../../apiSchema';
import {
  VideoInfo,
  videoInfoInitialState,
  videoInfoReducer,
} from '../../states/videoInfo';
import { trpc } from '../../trpc';

export const VideoInfoContext = createContext<VideoInfo>(null);

export const VideoInfoSetFilePathContext =
  createContext<(filePath: string) => void>(null);

export const VideoInfoContextsProvider = (props: { children: ReactNode }) => {
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
  return (
    <VideoInfoContext.Provider value={videoInfo}>
      <VideoInfoSetFilePathContext.Provider
        value={(filePath: string) => {
          dispatchVideoInfo({ type: 'SET_FILE_PATH', filePath });
        }}
      >
        {props.children}
      </VideoInfoSetFilePathContext.Provider>
    </VideoInfoContext.Provider>
  );
};
