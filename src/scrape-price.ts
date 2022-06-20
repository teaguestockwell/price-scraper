import { amazon } from './retailers';
import { scrapeMeta, merge } from './common';
import { ScrapeMeta, getNullScrape } from './types';

const importantFields: (keyof ScrapeMeta)[] = ['price', 'title', 'url'];

const hasImportantFields = (meta: ScrapeMeta): boolean => {
  return importantFields.every(field => !!meta[field]);
};

const getExpo = (backOffCoefficient: number) => {
  let backOff = 1;
  return {
    wait: async () => {
      backOff **= backOffCoefficient;
      await new Promise(resolve => setTimeout(resolve, backOff));
    },
  };
};

export type DispatchOptions = {
  url: string;
  backOffCoefficient: number;
};

export const scrapePrice = async (options: DispatchOptions) => {
  const { url, backOffCoefficient } = options;
  const hostName = new URL(url).hostname;

  if (hostName.includes('amazon')) {
    return amazon(options.url);
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

  const expo = getExpo(backOffCoefficient);
  await expo.wait();

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

  await expo.wait();

  merged = merge(
    merged,
    await scrapeMeta({
      url,
      type: 'headed',
      wait: 500,
    }).catch()
  );

  if (hasImportantFields(merged)) {
    return merged;
  }

  await expo.wait();

  merged = merge(
    merged,
    await scrapeMeta({
      url,
      type: 'headed',
      wait: 2000,
    }).catch()
  );

  return merged;
};
