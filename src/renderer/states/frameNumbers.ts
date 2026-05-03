import { clamp } from '../../utils/clamp';

export type FrameNumbersState = {
  min: number;
  leftLimit: number;
  start: number;
  midLimit: number;
  end: number;
  rightLimit: number;
  max: number;
};

export type FrameNumbersAction =
  | { type: 'RESET'; frameCount: number }
  | { type: 'SET_LEFT_LIMIT'; leftLimit: number }
  | { type: 'SET_START'; start: number }
  | { type: 'SET_MID_LIMIT'; midLimit: number }
  | { type: 'SET_END'; end: number }
  | { type: 'SET_RIGHT_LIMIT'; rightLimit: number };

export const frameNumbersInitialState: FrameNumbersState = {
  min: 0,
  leftLimit: 0,
  start: 0,
  midLimit: 0,
  end: 0,
  rightLimit: 0,
  max: 0,
};

export const frameNumbersReducer = (
  state: FrameNumbersState,
  action: FrameNumbersAction,
): FrameNumbersState => {
  switch (action.type) {
    case 'RESET': {
      const maxIndex = Math.max(0, action.frameCount - 1);

      return {
        min: 0,
        leftLimit: 0,
        start: 0,
        midLimit: Math.floor(maxIndex / 2),
        end: maxIndex,
        rightLimit: maxIndex,
        max: maxIndex,
      };
    }
    case 'SET_LEFT_LIMIT':
      return {
        ...state,
        leftLimit: clamp(action.leftLimit, state.min, state.start),
      };
    case 'SET_START':
      return {
        ...state,
        start: clamp(action.start, state.leftLimit, state.midLimit),
      };
    case 'SET_MID_LIMIT':
      return {
        ...state,
        midLimit: clamp(action.midLimit, state.start, state.end),
      };
    case 'SET_END':
      return {
        ...state,
        end: clamp(action.end, state.midLimit, state.rightLimit),
      };
    case 'SET_RIGHT_LIMIT':
      return {
        ...state,
        rightLimit: clamp(action.rightLimit, state.end, state.max),
      };
    default:
      throw new Error('Unhandled action type');
  }
};
