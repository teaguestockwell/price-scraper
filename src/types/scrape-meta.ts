import { ItemAvailability, OfferItemCondition } from 'schema-dts';
import { Currency } from './currency';

export type ScrapeMeta = {
  hostname: string | null;
  image: string | null;
  name: string | null;
  title: string | null;
  url: string;
  price: number | null;
  currency: Currency['code'] | null;
  condition: OfferItemCondition | null;
  sku: string | null;
  mpn: string | null;
  availability: ItemAvailability | null;
  asin: string | null;
};

export const getNullScrapeMeta = (url: string): ScrapeMeta => ({
  hostname: new URL(url).hostname,
  name: null,
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
});
