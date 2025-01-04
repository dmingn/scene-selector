export type BinarySearchState = {
  left: number;
  mid: number;
  right: number;
  undoable: boolean;
  undoStack: { left: number; right: number }[];
};

export type BinarySearchAction =
  | { type: 'RESET'; left: number; right: number }
  | { type: 'BISECT_LEFT' }
  | { type: 'BISECT_RIGHT' }
  | { type: 'UNDO' };

export const binarySearchInitialState: BinarySearchState = {
  left: 0,
  mid: 0,
  right: 0,
  undoable: false,
  undoStack: [],
};

export const binarySearchReducer = (
  state: BinarySearchState,
  action: BinarySearchAction,
): BinarySearchState => {
  let { left, right, undoStack } = state;

  switch (action.type) {
    case 'UNDO':
      if (state.undoStack.length === 0) {
        return state;
      }

      const lastState = state.undoStack[state.undoStack.length - 1];

      left = lastState.left;
      right = lastState.right;
      undoStack = state.undoStack.slice(0, -1);

      break;
    case 'RESET':
      left = action.left;
      right = action.right;
      undoStack = [];
      break;
    case 'BISECT_LEFT':
      right = state.mid;
      undoStack = [
        ...state.undoStack,
        { left: state.left, right: state.right },
      ];
      break;
    case 'BISECT_RIGHT':
      left = state.mid;
      undoStack = [
        ...state.undoStack,
        { left: state.left, right: state.right },
      ];
      break;
    default:
      throw new Error('Unhandled action type');
  }

  const mid = Math.floor((left + right) / 2);

  return {
    left,
    mid,
    right,
    undoable: undoStack.length > 0,
    undoStack,
  };
};
