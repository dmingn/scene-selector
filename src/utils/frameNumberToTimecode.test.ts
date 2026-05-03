import { expect, test } from '@jest/globals';
import { frameNumberToTimecode } from './frameNumberToTimecode';

test.each([
  [0, 30, '00:00:00.000000'],
  [60 * 30, 30, '00:01:00.000000'],
  [60 * 60 * 30, 30, '01:00:00.000000'],
  [100 * 60 * 60 * 30, 30, '100:00:00.000000'],
  [1, 30, '00:00:00.033333'],
  [20, 30, '00:00:00.666667'],
])('frameNumberToTimecode(%i, %i) = %s', (frameNumber, fps, expression) => {
  expect(frameNumberToTimecode(frameNumber, fps)).toBe(expression);
});

test.each([
  ['undefined frameNumber', undefined, 30],
  ['undefined fps', 0, undefined],
  ['null frameNumber', null, 30],
  ['null fps', 0, null],
  ['zero fps', 0, 0],
  ['NaN frameNumber', NaN, 30],
  ['NaN fps', 0, NaN],
] as const)('frameNumberToTimecode returns placeholder (%s)', (_label, frameNumber, fps) => {
  expect(frameNumberToTimecode(frameNumber, fps)).toBe('--:--:--');
});
