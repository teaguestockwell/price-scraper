import { Product } from './product';
import puppeteer from 'puppeteer-extra';
import stealth from 'puppeteer-extra-plugin-stealth'

const p = puppeteer.use(stealth());

export type ScrapeOptions = {
  url: string,
  headless?: boolean,
  waitAfterNavigate?: number
  screenshot?: boolean,
  eval: () => Omit<Product, 'url'>,
}

export const scrape = async (options: ScrapeOptions): Promise<Product> => {
  try {
    const browser = await p.launch({headless: options.headless});
    const page = await browser.newPage();
    try {
      await page.goto(options.url,);
      await page.waitForTimeout(options.waitAfterNavigate ?? 0)
      if (options.screenshot) {
        await page.setViewport({ width: 1920, height: 1080 });
        await page.evaluate(() => {
          window.scrollTo(0,window.document.body.scrollHeight)
        });
        await page.screenshot({path: 'screenshot.jpeg', type: 'jpeg', fullPage: true})
      }
      const product = await page.evaluate(options.eval)
      await page.close()
      await browser.close()
      return {
        ...product,
        url: options.url,
      }
    } catch (e) {
      await browser.close()
      throw e
    }
  } catch (e) {
    console.error(e)
  }
  return {
    url: options.url,
    title: '',
  }
}