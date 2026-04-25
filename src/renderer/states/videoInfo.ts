export type VideoInfo =
  | {
      state: 'IDLE';
      filePath: undefined;
      fps: undefined;
      frameCount: undefined;
      errorMessage?: undefined;
    }
  | {
      state: 'FETCHING';
      filePath: string;
      fps: undefined;
      frameCount: undefined;
      errorMessage?: undefined;
    }
  | {
      state: 'FETCHED';
      filePath: string;
      fps: number;
      frameCount: number;
      errorMessage?: undefined;
    }
  | {
      state: 'ERROR';
      filePath: string;
      fps: undefined;
      frameCount: undefined;
      errorMessage: string;
    };

export type VideoInfoAction =
  | { type: 'RESET' }
  | { type: 'SET_FILE_PATH'; filePath: string }
  | { type: 'SET_INFO'; fps: number; frameCount: number }
  | { type: 'SET_ERROR'; errorMessage: string };

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
    case 'SET_ERROR':
      if (state.state === 'IDLE') {
        throw new Error('Unexpected action');
      }

      return {
        state: 'ERROR',
        filePath: state.filePath,
        fps: undefined,
        frameCount: undefined,
        errorMessage: action.errorMessage,
      };
    default:
      throw new Error('Unhandled action type');
  }
};
