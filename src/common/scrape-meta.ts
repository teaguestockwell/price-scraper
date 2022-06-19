import { getBrowser, metascraper } from './clients';
import { getNullScrapeMeta, ScrapeMeta } from '../types/scrape-meta';
import { ScrapeOptions } from '../types/scrape-options';
import axios from 'axios'

export const scrapeMeta = async (
  options: Omit<ScrapeOptions, 'eval'>
): Promise<ScrapeMeta> => {
  if (options.type === 'cli') {
    try {
      const res = await axios(options.url);
      return metascraper({ html: res.data, url: options.url });
    } catch {
      return getNullScrapeMeta(options.url);
    }
  }

  const browser = await getBrowser({ type: options.type });
  const page = await browser.newPage();

  try {
    await page.goto(options.url);
    await page.waitForTimeout(options.wait);
    const html = await page.content();
    await page.close();
    return metascraper({
      html,
      url: options.url,
    });
  } catch {
    try {
      await page.close();
    } catch {}
    return getNullScrapeMeta(options.url);
  }
};
