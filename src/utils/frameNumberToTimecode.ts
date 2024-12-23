export const frameNumberToTimecode = (
  frameNumber: number,
  fps: number,
): string => {
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
