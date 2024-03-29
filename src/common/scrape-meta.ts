import { getBrowser, metascraper, http, getPage } from './clients';
import { getNullScrapeMeta, ScrapeMeta } from '../types/scrape-meta';
import { ScrapeOptions } from '../types/scrape-options';
import { merge } from './merge';

export const scrapeMeta = async (
  options: Omit<ScrapeOptions, 'eval'>
): Promise<ScrapeMeta> => {
  if (options.type === 'cli') {
    try {
      const { data } = await http(options.url);
      const meta = await metascraper({ html: data, url: options.url });
      return merge(getNullScrapeMeta(options.url), meta);
    } catch {
      return getNullScrapeMeta(options.url);
    }
  }

  const browser = await getBrowser({ type: options.type });
  const page = await getPage(browser);

  try {
    await page.goto(options.url);
    await page.waitForTimeout(options.wait ?? 0);
    const html = await page.content();
    const title = await page.title();
    await page.close();
    const meta = await metascraper({ html, url: options.url });
    return merge(getNullScrapeMeta(options.url), { title }, meta);
  } catch {
    try {
      await page.close();
    } catch {}
    return getNullScrapeMeta(options.url);
  }
};
