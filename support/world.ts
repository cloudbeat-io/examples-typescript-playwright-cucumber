import {
  setWorldConstructor,
  World,
  IWorldOptions,
  Before,
  After,
  AfterStep,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { cb, wrapPlaywrightPage } from '@cloudbeat/cucumber';
import * as fs from 'fs';
import * as path from 'path';

setDefaultTimeout(30 * 1000);

const tracesDir = 'reports/traces';
const videosDir = 'reports/videos';

export interface CbWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  secondPage?: Page;
  testName: string;
  startTime: Date;
}

export class PlaywrightWorld extends World implements CbWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  secondPage?: Page;
  testName!: string;
  startTime!: Date;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);

Before(async function (this: CbWorld, { pickle }) {
  cb.setWorld(this);
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');

  // PW_TEST_CONNECT_WS_ENDPOINT+CB_AGENT is set by CloudBeat when running in a containerized environment
  // where browsers are provided by a remote Playwright server.
  // Therefore we connect to the remote server when the variables are present, and fall back to a
  // local launch for regular usage.
  this.browser = process.env.PW_TEST_CONNECT_WS_ENDPOINT && process.env.CB_AGENT
    ? await chromium.connect(process.env.PW_TEST_CONNECT_WS_ENDPOINT)
    : await chromium.launch({ headless: true });

  this.context = await this.browser.newContext({
    recordVideo: { dir: videosDir },
  });

  await this.context.tracing.start({ screenshots: true, snapshots: true });

  const rawPage = await this.context.newPage();
  this.page = wrapPlaywrightPage(rawPage, this) as Page;
});

AfterStep(async function (this: CbWorld, { result }) {
  if (result && result.status !== Status.PASSED) {
    try {
      const image = await this.page?.screenshot();
      if (image) {
        this.attach(image, 'image/png');
      } else {
        console.error('Failed to take page screenshot for failed step');
      }
    } catch (e: any) {
      console.error('Failed to take page screenshot for failed step: ' + e.message);
    }
  }
});

After(async function (this: CbWorld, { result }) {
  // capture every page opened in the context (e.g. additional tabs) before it's closed,
  // since recordVideo produces one video per page, not just for this.page
  const pages = this.context?.pages() ?? [];

  if (result && result.status !== Status.PASSED) {
    try {
      const timePart = this.startTime?.toISOString().split('.')[0].replaceAll(':', '_');
      const tracePath = path.resolve(tracesDir, `${this.testName}-${timePart}-trace.zip`);
      fs.mkdirSync(tracesDir, { recursive: true });
      await this.context?.tracing.stop({ path: tracePath });
      cb.addAttachment('trace', tracePath);
    } catch (e: any) {
      console.error('Failed to stop tracing: ' + e.message);
    }
  } else {
    try {
      await this.context?.tracing.stop();
    } catch (e: any) {
      console.error('Failed to stop tracing: ' + e.message);
    }
  }

  await this.page?.close();
  await this.context?.close();

  // attach videos. this should be done after the page/context is closed so each video is properly finalized
  if (result && result.status !== Status.PASSED) {
    for (const [index, page] of pages.entries()) {
      const video = page.video();
      if (!video) {
        continue;
      }
      try {
        const suffix = pages.length > 1 ? `-tab${index + 1}` : '';
        const videoPath = path.resolve(videosDir, `${this.testName}${suffix}.webm`);
        fs.mkdirSync(videosDir, { recursive: true });
        await video.saveAs(videoPath);
        cb.addAttachment('video', videoPath);
      } catch (e: any) {
        console.error(`Failed to retreive video for tab ${index + 1}: ` + e.message);
      }
    }
  }

  await this.browser?.close();
});
