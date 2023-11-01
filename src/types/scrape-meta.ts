import { ItemAvailability, OfferItemCondition } from 'schema-dts';
import { Currency } from './currency';
import { ScrapeMetaWithMeta } from './scrape-options';

export type ScrapeMeta = {
  domain: string | null;
  image: string | null;
  title: string | null;
  url: string;
  price: number | null;
  currency: Currency['code'] | null;
  condition: OfferItemCondition | null;
  sku: string | null;
  mpn: string | null;
  availability: ItemAvailability | null;
  asin: string | null;
  description: string | null;
};

export const getNullScrapeMeta = (url: string): ScrapeMetaWithMeta => ({
  domain: new URL(url).hostname.split('.').slice(-2).join('.'),
  title: null,
  image: null,
  url,
  price: null,
  currency: null,
  condition: null,
  sku: null,
  mpn: null,
  availability: null,
  asin: null,
  meta: null,
  description: null,
});

export const getNullScrape = (url: string) => {
  const { meta, ...rest } = getNullScrapeMeta(url);
  return rest;
};
