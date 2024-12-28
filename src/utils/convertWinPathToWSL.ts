export const convertWinPathToWSL = (winPath: string): string => {
  return winPath
    .replace(/\\/g, '/')
    .replace(/^([a-zA-Z]):/, (match, drive) => `/mnt/${drive.toLowerCase()}`);
};
