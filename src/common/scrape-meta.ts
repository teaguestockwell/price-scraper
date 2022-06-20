import { getBrowser, metascraper, http } from './clients';
import { getNullScrapeMeta, ScrapeMeta } from '../types/scrape-meta';
import { ScrapeOptions } from '../types/scrape-options';
import { merge } from './merge';

export const scrapeMeta = async (
  options: Omit<ScrapeOptions, 'eval'>
): Promise<ScrapeMeta> => {
  if (options.type === 'cli') {
    try {
      const { data } = await http(options.url);
      const title = data.match(/<title>(.*?)<\/title>/i)?.[1];
      const meta = await metascraper({ html: data, url: options.url });
      return merge(getNullScrapeMeta(options.url), { title }, meta);
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
    const title = await page.title();
    await page.close();
    const meta = await metascraper({ html, url: options.url });
    return merge(getNullScrapeMeta(options.url), { title }, meta);
  } catch {
    try {
      await page.close();
    } catch {}
    return getNullScrapeMeta(options.url)
  }
};
