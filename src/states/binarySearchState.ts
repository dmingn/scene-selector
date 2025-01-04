export type BinarySearchState = { left: number; mid: number; right: number };

export type BinarySearchAction =
  | { type: 'RESET'; left: number; right: number }
  | { type: 'BISECT_LEFT' }
  | { type: 'BISECT_RIGHT' };

export const binarySearchInitialState: BinarySearchState = {
  left: 0,
  mid: 0,
  right: 0,
};

export const binarySearchReducer = (
  state: BinarySearchState,
  action: BinarySearchAction,
): BinarySearchState => {
  let { left, right } = state;

  switch (action.type) {
    case 'RESET':
      left = action.left;
      right = action.right;
      break;
    case 'BISECT_LEFT':
      right = state.mid;
      break;
    case 'BISECT_RIGHT':
      left = state.mid;
      break;
    default:
      throw new Error('Unhandled action type');
  }

  const mid = Math.floor((left + right) / 2);

  return { left, mid, right };
};
