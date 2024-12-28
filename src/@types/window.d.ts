import type { WebUtils } from 'electron';

declare global {
  interface Window {
    platform: NodeJS.Platform;
    webUtils: WebUtils;
  }
}
