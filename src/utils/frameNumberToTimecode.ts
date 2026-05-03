const missingTimecode = '--:--:--';

export const frameNumberToTimecode = (
  frameNumber: number | undefined | null,
  fps: number | undefined | null,
): string => {
  if (
    frameNumber == null ||
    fps == null ||
    fps === 0 ||
    !Number.isFinite(frameNumber) ||
    !Number.isFinite(fps)
  ) {
    return missingTimecode;
  }

  const totalSeconds = frameNumber / fps;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const decimalSeconds = totalSeconds % 1;

  return (
    [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':') +
    '.' +
    Math.round(decimalSeconds * 10 ** 6)
      .toString()
      .padStart(6, '0')
  );
};
