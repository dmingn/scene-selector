import { expect, test } from '@jest/globals';
import { getOutPath } from './getOutPath';

test.each([
  ['hoge.fuga', 0, 1, 'hoge-0-1.fuga'],
  ['hoge.fuga.piyo', 0, 1, 'hoge.fuga-0-1.piyo'],
])(
  'getOutPath(%s, %i, %i) = %s',
  (filePath, startFrameNumber, endFrameNumber, expected) => {
    expect(getOutPath(filePath, startFrameNumber, endFrameNumber)).toBe(
      expected,
    );
  },
);
