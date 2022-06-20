import { getNullScrapeMeta } from '../types/scrape-meta';
import { ScrapeMetaWithMeta, ScrapeOptions } from '../types/scrape-options';
import { getBrowser } from './clients';
import { merge } from './merge'

export const scrape = async (options: ScrapeOptions): Promise<ScrapeMetaWithMeta> => {
  if (options.type === 'cli') {
    throw new Error('CLI scraping is not supported yet');
  }

  const browser = await getBrowser({ type: options.type });
  const page = await browser.newPage();

  try {
    await page.goto(options.url);
    await page.waitForTimeout(options.wait);
    const partial = await page.evaluate(options.eval);
    const title = await page.title();
    await page.close();
    return merge(getNullScrapeMeta(options.url), { title }, partial);
  } catch {
    try {
      await page.close();
    } catch {}
    return getNullScrapeMeta(options.url);
  }
};
