import { route } from './retailers';
import { scrapeMeta, merge } from './common';
import { ScrapeMeta, getNullScrape } from './types';

const importantFields: (keyof ScrapeMeta)[] = ['price', 'title', 'url'];

const hasImportantFields = (meta: ScrapeMeta): boolean => {
  return importantFields.every((field) => !!meta[field]);
};


export type DispatchOptions = {
  url: string;
};

export const scrapePrice = async (options: DispatchOptions) => {
  const { url } = options;
  const hostName = new URL(url).hostname;

  const retailer = route(hostName);
  if (retailer) {
    return retailer(options.url);
  }

  let merged = getNullScrape(url);

  merged = merge(
    merged,
    await scrapeMeta({
      url,
      type: 'cli',
      wait: 0,
    }).catch()
  );

  if (hasImportantFields(merged)) {
    return merged;
  }

  merged = merge(
    merged,
    await scrapeMeta({
      url,
      type: 'headless',
      wait: 100,
    }).catch()
  );

  if (hasImportantFields(merged)) {
    return merged;
  }

  merged = merge(
    merged,
    await scrapeMeta({
      url,
      type: 'headed',
      wait: 1000,
    }).catch()
  );

  return merged;
};
