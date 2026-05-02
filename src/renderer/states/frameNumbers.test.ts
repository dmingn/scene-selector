import { describe, expect, it } from '@jest/globals';
import { frameNumbersInitialState, frameNumbersReducer } from './frameNumbers';

describe('frameNumbersReducer', () => {
  describe('RESET', () => {
    it('initializes to all zeros when frameCount is <= 0', () => {
      const cases = [-1, 0];

      for (const frameCount of cases) {
        const state = frameNumbersReducer(frameNumbersInitialState, {
          type: 'RESET',
          frameCount,
        });

        expect(state).toEqual({
          min: 0,
          leftLimit: 0,
          start: 0,
          midLimit: 0,
          end: 0,
          rightLimit: 0,
          max: 0,
        });
      }
    });

    it('initializes mid/end/right/max from max(0, frameCount - 1)', () => {
      const cases: Array<{ frameCount: number; expected: typeof frameNumbersInitialState }> =
        [
          {
            frameCount: 1,
            expected: {
              min: 0,
              leftLimit: 0,
              start: 0,
              midLimit: 0,
              end: 0,
              rightLimit: 0,
              max: 0,
            },
          },
          {
            frameCount: 2,
            expected: {
              min: 0,
              leftLimit: 0,
              start: 0,
              midLimit: 0,
              end: 1,
              rightLimit: 1,
              max: 1,
            },
          },
          {
            frameCount: 101,
            expected: {
              min: 0,
              leftLimit: 0,
              start: 0,
              midLimit: 50,
              end: 100,
              rightLimit: 100,
              max: 100,
            },
          },
        ];

      for (const { frameCount, expected } of cases) {
        const state = frameNumbersReducer(frameNumbersInitialState, {
          type: 'RESET',
          frameCount,
        });

        expect(state).toEqual(expected);
      }
    });
  });

  it('SET_START does not move neighbors (clamps to limits)', () => {
    const initial = frameNumbersReducer(frameNumbersInitialState, {
      type: 'RESET',
      frameCount: 101,
    });

    const next = frameNumbersReducer(initial, { type: 'SET_START', start: -10 });
    expect(next.start).toBe(0);
    expect(next.leftLimit).toBe(0);
    expect(next.midLimit).toBe(50);
  });

  it('SET_LEFT_LIMIT does not move start (clamps to start)', () => {
    const initial = frameNumbersReducer(frameNumbersInitialState, {
      type: 'RESET',
      frameCount: 101,
    });

    const next = frameNumbersReducer(initial, { type: 'SET_LEFT_LIMIT', leftLimit: 80 });
    expect(next.leftLimit).toBe(0);
    expect(next.start).toBe(0);
  });
});
