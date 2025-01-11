import { describe, expect, it } from '@jest/globals';
import {
  BinarySearchAction,
  binarySearchInitialState,
  binarySearchReducer,
} from './binarySearchState';

describe('binarySearchReducer', () => {
  it('should handle RESET action', () => {
    const action: BinarySearchAction = { type: 'RESET', left: 0, right: 100 };
    const newState = binarySearchReducer(binarySearchInitialState, action);
    expect(newState).toEqual({
      left: 0,
      mid: 50,
      right: 100,
      undoable: false,
      undoStack: [],
    });
  });

  it('should handle BISECT_LEFT action', () => {
    const initialState = {
      ...binarySearchInitialState,
      left: 0,
      mid: 50,
      right: 100,
    };
    const action: BinarySearchAction = { type: 'BISECT_LEFT' };
    const newState = binarySearchReducer(initialState, action);
    expect(newState).toEqual({
      left: 0,
      mid: 25,
      right: 50,
      undoable: true,
      undoStack: [{ left: 0, right: 100 }],
    });
  });

  it('should handle BISECT_RIGHT action', () => {
    const initialState = {
      ...binarySearchInitialState,
      left: 0,
      mid: 50,
      right: 100,
    };
    const action: BinarySearchAction = { type: 'BISECT_RIGHT' };
    const newState = binarySearchReducer(initialState, action);
    expect(newState).toEqual({
      left: 50,
      mid: 75,
      right: 100,
      undoable: true,
      undoStack: [{ left: 0, right: 100 }],
    });
  });

  it('should handle UNDO action', () => {
    const initialState = {
      ...binarySearchInitialState,
      left: 0,
      mid: 25,
      right: 50,
      undoable: true,
      undoStack: [{ left: 0, right: 100 }],
    };
    const action: BinarySearchAction = { type: 'UNDO' };
    const newState = binarySearchReducer(initialState, action);
    expect(newState).toEqual({
      left: 0,
      mid: 50,
      right: 100,
      undoable: false,
      undoStack: [],
    });
  });

  it('should not change state on UNDO action if undoStack is empty', () => {
    const action: BinarySearchAction = { type: 'UNDO' };
    const newState = binarySearchReducer(binarySearchInitialState, action);
    expect(newState).toEqual(binarySearchInitialState);
  });
});
