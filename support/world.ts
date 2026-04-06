import { setWorldConstructor, World, IWorldOptions, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { cb, wrapPlaywrightPage } from '@cloudbeat/cucumber';

setDefaultTimeout(30 * 1000);

export interface CbWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

export class PlaywrightWorld extends World implements CbWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);

Before(async function (this: CbWorld) {
  cb.setWorld(this);
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext({
    recordVideo: { dir: 'reports/videos/' },
  });
  const rawPage = await this.context.newPage();
  this.page = wrapPlaywrightPage(rawPage, this) as Page;
});

After(async function (this: CbWorld) {
  await this.context?.close();
  await this.browser?.close();
});
