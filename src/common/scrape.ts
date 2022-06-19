import { http } from './clients';
import { getNullScrapeMeta, ScrapeMeta} from '../types/scrape-meta';
import { ScrapeOptions } from '../types/scrape-options';
import { getBrowser } from './clients';

export const scrape = async (options: ScrapeOptions): Promise<ScrapeMeta> => {
  if (options.type === 'cli') {
    try {
      const res = await http(options.url);
      const partial = options.eval(res.data);
      return {
        ...getNullScrapeMeta(options.url),
        ...partial,
      }
    } catch {
      return getNullScrapeMeta(options.url);
    }
  }

  const browser = await getBrowser({ type: options.type });
  const page = await browser.newPage();

  try {
    await page.goto(options.url);
    await page.waitForTimeout(options.wait);
    const partial = await page.evaluate(options.eval);
    const name = await page.title();
    await page.close();
    return {
      ...getNullScrapeMeta(options.url),
      name,
      ...partial,
    };
  } catch {
    try {
      await page.close();
    } catch {}
    return getNullScrapeMeta(options.url);
  }
};
