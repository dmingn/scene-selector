import type { WebUtils } from 'electron';

declare global {
  interface Window {
    webUtils: WebUtils;
  }
}
