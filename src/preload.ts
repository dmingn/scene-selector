import { contextBridge, webUtils } from 'electron';
import { exposeElectronTRPC } from 'electron-trpc/main';

process.once('loaded', async () => {
  contextBridge.exposeInMainWorld('webUtils', webUtils);
  exposeElectronTRPC();
});
