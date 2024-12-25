export const getOutPath = (
  filePath: string,
  startFrameNumber: number,
  endFrameNumber: number,
) => {
  const parts = filePath.split('.');
  const dir_and_base = parts.slice(0, -1).join('.');
  const ext = parts[parts.length - 1];

  const modifiedBase = `${dir_and_base}-${startFrameNumber}-${endFrameNumber}`;

  return `${modifiedBase}.${ext}`;
};
