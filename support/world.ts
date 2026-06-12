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
  testName: string;
  startTime: Date;
}

export class PlaywrightWorld extends World implements CbWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
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


const wsEndpoint = process.env.PW_TEST_CONNECT_WS_ENDPOINT;

const url = new URL(wsEndpoint);
url.searchParams.set('launch-options', JSON.stringify({ headless: false }));


  this.browser = process.env.PW_TEST_CONNECT_WS_ENDPOINT && process.env.CB_AGENT
    ? await chromium.connect(url.toString())
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
  // get video reference while it's available (before the page is closed)
  const video = await this.page?.video();

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

  // attach video. this should be done after page is closed so the video is properly finalized
  if (result && result.status !== Status.PASSED && video) {
    try {
      const videoPath = path.resolve('reports/videos', `${this.testName}.webm`);
      fs.mkdirSync('reports/videos', { recursive: true });
      await video.saveAs(videoPath);
      cb.addAttachment('video', videoPath);
    } catch (e: any) {
      console.error('Failed to retreive video: ' + e.message);
    }
  }

  await this.browser?.close();
});
