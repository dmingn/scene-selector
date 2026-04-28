import { describe, expect, it } from '@jest/globals';
import {
  buildCandidates,
  narrowRangeByCandidateIndex,
  RangeNarrowingAction,
  rangeNarrowingInitialState,
  rangeNarrowingReducer,
} from './rangeNarrowingState';

describe('rangeNarrowingCandidates', () => {
  describe('buildCandidates', () => {
    it('returns empty array when count <= 0', () => {
      expect(buildCandidates({ left: 0, right: 10, count: 0 })).toEqual([]);
    });

    it('returns single value when left >= right', () => {
      expect(buildCandidates({ left: 5, right: 5, count: 7 })).toEqual([5]);
      expect(buildCandidates({ left: 6, right: 5, count: 7 })).toEqual([6]);
    });

    it('includes left and right and is sorted', () => {
      const candidates = buildCandidates({ left: 0, right: 100, count: 7 });
      expect(candidates[0]).toBe(0);
      expect(candidates[candidates.length - 1]).toBe(100);
      expect([...candidates].sort((a, b) => a - b)).toEqual(candidates);
    });
  });

  describe('narrowRangeByCandidateIndex', () => {
    it('falls back to original range when candidates is empty', () => {
      expect(
        narrowRangeByCandidateIndex({ candidates: [], index: 0 }),
      ).toBeNull();
    });

    it('narrows to neighbor-candidate interval', () => {
      const candidates = [0, 300, 600, 900, 1199, 1499, 1799];
      expect(
        narrowRangeByCandidateIndex({ candidates, index: 1 }),
      ).toEqual({ left: 0, right: 600 });
      expect(
        narrowRangeByCandidateIndex({ candidates, index: 0 }),
      ).toEqual({ left: 0, right: 300 });
      expect(
        narrowRangeByCandidateIndex({ candidates, index: 6 }),
      ).toEqual({ left: 1499, right: 1799 });
    });
  });
});

describe('rangeNarrowingReducer', () => {
  it('should handle RESET action', () => {
    const action: RangeNarrowingAction = { type: 'RESET', left: 0, right: 100 };
    const newState = rangeNarrowingReducer(rangeNarrowingInitialState, action);
    expect(newState).toEqual({
      left: 0,
      right: 100,
      candidates: [0, 17, 33, 50, 67, 83, 100],
      undoable: false,
      undoStack: [],
    });
  });

  it('should handle ZOOM_IN action', () => {
    const initialState = {
      ...rangeNarrowingInitialState,
      left: 0,
      right: 100,
      candidates: [0, 17, 33, 50, 67, 83, 100],
    };
    const action: RangeNarrowingAction = { type: 'ZOOM_IN', index: 1 };
    const newState = rangeNarrowingReducer(initialState, action);
    expect(newState).toEqual({
      left: 0,
      right: 33,
      candidates: [0, 6, 11, 17, 22, 28, 33],
      undoable: true,
      undoStack: [{ left: 0, right: 100 }],
    });
  });

  it('should handle UNDO action', () => {
    const initialState = {
      ...rangeNarrowingInitialState,
      left: 0,
      right: 33,
      candidates: [0, 6, 11, 17, 22, 28, 33],
      undoable: true,
      undoStack: [{ left: 0, right: 100 }],
    };
    const action: RangeNarrowingAction = { type: 'UNDO' };
    const newState = rangeNarrowingReducer(initialState, action);
    expect(newState).toEqual({
      left: 0,
      right: 100,
      candidates: [0, 17, 33, 50, 67, 83, 100],
      undoable: false,
      undoStack: [],
    });
  });

  it('should not change state on UNDO action if undoStack is empty', () => {
    const action: RangeNarrowingAction = { type: 'UNDO' };
    const newState = rangeNarrowingReducer(rangeNarrowingInitialState, action);
    expect(newState).toEqual(rangeNarrowingInitialState);
  });
});
