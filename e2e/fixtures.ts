import path from 'path';
import {
  test as base,
  expect,
  _electron as electron,
  type ElectronApplication,
  type Page,
} from '@playwright/test';

type AppFixtures = {
  repoRoot: string;
  videoVga1mPath: string;
  appEnv: NodeJS.ProcessEnv;
  electronApp: ElectronApplication;
  page: Page;
};

export const test = base.extend<AppFixtures>({
  repoRoot: async (_args, use) => {
    await use(path.resolve(__dirname, '..'));
  },

  videoVga1mPath: async ({ repoRoot }, use) => {
    await use(path.join(repoRoot, 'videos', 'avsynctest-vga-1m.mp4'));
  },

  appEnv: [{}, { option: true }],

  electronApp: async ({ repoRoot, appEnv }, use) => {
    const electronApp = await electron.launch({
      args: [path.join(repoRoot, '.vite', 'build', 'main.js')],
      env: {
        ...process.env,
        NODE_ENV: 'test',
        ...appEnv,
      },
    });

    await use(electronApp);
    await electronApp.close();
  },

  page: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await use(page);
  },
});

export { expect };

