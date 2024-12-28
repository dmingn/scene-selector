import { createContext } from 'react';

export const VideoContext = createContext({
  filePath: null as string | null,
  frameCount: 0,
  fps: 0,
});
