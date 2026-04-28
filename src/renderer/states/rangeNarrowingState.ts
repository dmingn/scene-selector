export type RangeNarrowingState = {
  left: number;
  right: number;
  candidates: number[];
  undoable: boolean;
  undoStack: { left: number; right: number }[];
};

export type RangeNarrowingAction =
  | { type: 'RESET'; left: number; right: number }
  | { type: 'ZOOM_IN'; index: number }
  | { type: 'UNDO' };

const candidateCount = 7;

export const buildCandidates = (props: {
  left: number;
  right: number;
  count: number;
}): number[] => {
  if (props.count <= 0) {
    return [];
  }
  if (props.left >= props.right) {
    return [props.left];
  }

  const raw = Array.from({ length: props.count }, (_, i) => {
    if (props.count === 1) {
      return Math.floor((props.left + props.right) / 2);
    }
    const t = i / (props.count - 1);
    return Math.round(props.left + (props.right - props.left) * t);
  });

  return [...new Set([props.left, ...raw, props.right])].sort((a, b) => a - b);
};

export const narrowRangeByCandidateIndex = (props: {
  candidates: number[];
  index: number;
}): { left: number; right: number } | null => {
  const { candidates, index } = props;
  if (candidates.length === 0) {
    return null;
  }

  const i = Math.min(Math.max(index, 0), candidates.length - 1);

  const newLeft = i === 0 ? candidates[0] : candidates[i - 1];
  const newRight =
    i === candidates.length - 1 ? candidates[candidates.length - 1] : candidates[i + 1];

  return {
    left: Math.min(newLeft, newRight),
    right: Math.max(newRight, newLeft),
  };
};

export const rangeNarrowingInitialState: RangeNarrowingState = {
  left: 0,
  right: 0,
  candidates: [],
  undoable: false,
  undoStack: [],
};

export const rangeNarrowingReducer = (
  state: RangeNarrowingState,
  action: RangeNarrowingAction,
): RangeNarrowingState => {
  let { left, right, undoStack } = state;

  switch (action.type) {
    case 'UNDO': {
      if (state.undoStack.length === 0) {
        return state;
      }

      const lastState = state.undoStack[state.undoStack.length - 1];

      left = lastState.left;
      right = lastState.right;
      undoStack = state.undoStack.slice(0, -1);

      break;
    }
    case 'RESET':
      left = action.left;
      right = action.right;
      undoStack = [];
      break;
    case 'ZOOM_IN': {
      const next = narrowRangeByCandidateIndex({
        candidates: state.candidates,
        index: action.index,
      });
      if (next === null) {
        break;
      }
      left = next.left;
      right = next.right;
      undoStack = [
        ...state.undoStack,
        { left: state.left, right: state.right },
      ];
      break;
    }
    default:
      throw new Error('Unhandled action type');
  }

  const candidates = buildCandidates({ left, right, count: candidateCount });

  return {
    left,
    right,
    candidates,
    undoable: undoStack.length > 0,
    undoStack,
  };
};
