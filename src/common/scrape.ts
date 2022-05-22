import { Product } from './product';
import puppeteer from 'puppeteer-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

const p = puppeteer.use(stealth());

type ScrapeRes = Record<keyof Product, string>;

export type ScrapeOptions = {
  url: string;
  headless?: boolean;
  waitAfterNavigate?: number;
  screenshot?: boolean;
  eval: () => Omit<ScrapeRes, 'url' | 'title'>;
};

export const scrape = async (options: ScrapeOptions): Promise<ScrapeRes> => {
  try {
    const browser = await p.launch({ headless: options.headless });
    const page = await browser.newPage();
    try {
      await page.goto(options.url);
      await page.waitForTimeout(options.waitAfterNavigate ?? 0);
      if (options.screenshot) {
        await page.setViewport({ width: 1920, height: 1080 });
        await page.evaluate(() => {
          window.scrollTo(0, window.document.body.scrollHeight);
        });
        await page.screenshot({
          path: 'screenshot.jpeg',
          type: 'jpeg',
          fullPage: true,
        });
      }
      const product = await page.evaluate(options.eval);
      const title = await page.title();
      await browser.close();
      return {
        url: options.url,
        title,
        ...product,
      };
    } catch (e) {
      await browser.close();
      throw e;
    }
  } catch (e) {
    console.error(e);
  }
  return {
    url: options.url,
    title: '',
    src: '',
    price: '',
    currency: '',
    qty: '',
  };
};
