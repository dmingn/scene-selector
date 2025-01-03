import { clamp } from '../utils/clamp';

export interface FrameNumbersState {
  start: number;
  end: number;
  frameCount: number;
}

export type FrameNumbersAction =
  | { type: 'SET_START'; newValue: number }
  | { type: 'SET_END'; newValue: number }
  | { type: 'RESET'; frameCount: number };

export const frameNumbersInitialState: FrameNumbersState = {
  start: 0,
  end: 0,
  frameCount: 0,
};

export const frameNumbersReducer = (
  state: FrameNumbersState,
  action: FrameNumbersAction,
): FrameNumbersState => {
  switch (action.type) {
    case 'SET_START':
      return { ...state, start: clamp(action.newValue, 0, state.end) };
    case 'SET_END':
      return {
        ...state,
        end: clamp(action.newValue, state.start, state.frameCount - 1),
      };
    case 'RESET':
      return {
        start: 0,
        end: action.frameCount - 1,
        frameCount: action.frameCount,
      };
    default:
      throw new Error('Unhandled action type');
  }
};
