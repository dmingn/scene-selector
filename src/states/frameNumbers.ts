import { clamp } from '../utils/clamp';

export type FrameNumbersState = {
  min: number;
  start: number;
  end: number;
  max: number;
};

export type FrameNumbersAction =
  | { type: 'RESET'; frameCount: number }
  | { type: 'SET_START'; start: number }
  | { type: 'SET_END'; end: number };

export const frameNumbersInitialState: FrameNumbersState = {
  min: 0,
  start: 0,
  end: 0,
  max: 0,
};

export const frameNumbersReducer = (
  state: FrameNumbersState,
  action: FrameNumbersAction,
): FrameNumbersState => {
  switch (action.type) {
    case 'RESET':
      return {
        min: 0,
        start: 0,
        end: action.frameCount - 1,
        max: action.frameCount - 1,
      };
    case 'SET_START':
      return { ...state, start: clamp(action.start, state.min, state.end) };
    case 'SET_END':
      return { ...state, end: clamp(action.end, state.start, state.max) };
    default:
      throw new Error('Unhandled action type');
  }
};
