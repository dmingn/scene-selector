import { createContext } from 'react';

export type VideoInfo =
  | {
      state: 'IDLE';
      filePath: undefined;
      fps: undefined;
      frameCount: undefined;
    }
  | {
      state: 'FETCHING';
      filePath: string;
      fps: undefined;
      frameCount: undefined;
    }
  | {
      state: 'FETCHED';
      filePath: string;
      fps: number;
      frameCount: number;
    };

export type VideoInfoAction =
  | { type: 'RESET' }
  | { type: 'SET_FILE_PATH'; filePath: string }
  | { type: 'SET_INFO'; fps: number; frameCount: number };

export const videoInfoInitialState: VideoInfo = {
  state: 'IDLE',
  filePath: undefined,
  fps: undefined,
  frameCount: undefined,
};

export const videoInfoReducer = (
  state: VideoInfo,
  action: VideoInfoAction,
): VideoInfo => {
  switch (action.type) {
    case 'RESET':
      return {
        state: 'IDLE',
        filePath: undefined,
        fps: undefined,
        frameCount: undefined,
      };
    case 'SET_FILE_PATH':
      return {
        state: 'FETCHING',
        filePath: action.filePath,
        fps: undefined,
        frameCount: undefined,
      };
    case 'SET_INFO':
      if (state.state === 'IDLE') {
        throw new Error('Unexpected action');
      }

      return {
        state: 'FETCHED',
        filePath: state.filePath,
        fps: action.fps,
        frameCount: action.frameCount,
      };
    default:
      throw new Error('Unhandled action type');
  }
};

export const VideoInfoContext = createContext<VideoInfo>(videoInfoInitialState);
